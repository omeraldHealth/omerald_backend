const { getVaccine, createVaccine, createManyVaccines } = require('../../../../api/v1/controllers/vaccines'); // Import the function to be tested
const VaccinesModel = require('../../../../api/v1/models/vaccine'); // Import the model
const xlsx = require("xlsx")

jest.mock("../../../../api/v1/models/vaccine");

describe('getVaccine', () => {
  it('should return a list of vaccines', async () => {
    // Define a sample list of vaccines
    const mockVaccines = [
      { name: 'Vaccine1'},
      { name: 'Vaccine2'}
    ];

    // Mock the find method of the VaccinesModel
    VaccinesModel.find.mockResolvedValue(mockVaccines);

    // Define mock request and response objects
    const req = {};
    const res = {
      json: jest.fn() // Mock the json method
    };

    // Call the getVaccine function
    await getVaccine(req, res);

    // Assert that res.json has been called with the expected data
    expect(res.json).toHaveBeenCalledWith(mockVaccines);
  });

  it('should handle internal server error', async () => {
    // Mock request and response objects
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(), // Mock the status method
      json: jest.fn() // Mock the json method
    };

    // Mock VaccinesModel.find to throw an error
    VaccinesModel.find.mockRejectedValue(new Error('Some error'));

    // Call the getVaccine function
    await getVaccine(req, res);

    // Assert that res.status and res.json have been called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error: Some error' });
  });
});

// Creating a new vaccine with valid name.
// Handling invalid name.
// Handling internal server error.
describe('createVaccine', () => {

  it('should create a new vaccine', async () => {
    // Define the request body
    const req = { body: { name: 'New Vaccine' } };

    // Define a sample vaccine object
    const mockVaccine = { _id: '123', name: 'New Vaccine' };

    // Mock the create method of the VaccinesModel
    VaccinesModel.create.mockResolvedValue(mockVaccine);

    // Define mock response object
    const res = {
      status: jest.fn().mockReturnThis(), // Mock the status method
      json: jest.fn() // Mock the json method
    };

    // Call the createVaccine function
    await createVaccine(req, res);

    // Assert that res.status and res.json have been called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockVaccine);
  });

  it('should handle invalid name', async () => {
    // Define the request body with invalid name
    const req = { body: { name: '' } };

    // Define mock response object
    const res = {
      status: jest.fn().mockReturnThis(), // Mock the status method
      json: jest.fn() // Mock the json method
    };

    // Call the createVaccine function
    await createVaccine(req, res);

    // Assert that res.status and res.json have been called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith("Invalid Name");
  });

  it('should handle internal server error', async () => {
    // Define the request body
    const req = { body: { name: 'New Vaccine' } };

    // Mock VaccinesModel.create to throw an error
    VaccinesModel.create.mockRejectedValue(new Error('Some error'));

    // Define mock response object
    const res = {
      status: jest.fn().mockReturnThis(), // Mock the status method
      json: jest.fn() // Mock the json method
    };

    // Call the createVaccine function
    await createVaccine(req, res);

    // Assert that res.status and res.json have been called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error: Some error' });
  });
});

// Mock the xlsx library
jest.mock('xlsx', () => {
  return {
    read: jest.fn(),
    utils: {
      sheet_to_json: jest.fn()
    }
  };
});

describe('createManyVaccines', () => {
  // Define the request and response objects
  let req;
  let res;

  beforeEach(() => {
    // Define the request object with a mock file
    req = {
      file: {
        buffer: 'mock file buffer'
      }
    };

    // Define the response object with mocked methods
    res = {
      status: jest.fn().mockReturnThis(), // Mock the status method
      send: jest.fn(), // Mock the send method
      json: jest.fn() // Mock the json method
    };
  });

  it('should return 400 if no file is uploaded', async () => {
    // Modify the request object to have no file
    req.file = undefined;

    // Call the createManyVaccines function
    await createManyVaccines(req, res);

    // Assert that res.status and res.send have been called with the correct arguments
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('No file uploaded.');
  });

  jest.mock('xlsx');

  // it('should return 400 if worksheet name is incorrect', async () => {
  //   // Mock the xlsx.read method to return a mock workbook
  //  const workbook = xlsx.read(req.file.buffer);
  //   // Check if workbook is defined and has the expected structure
  //   if (workbook && workbook.SheetNames && workbook.SheetNames.length > 0) {
  //     const worksheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[worksheetName];
  //     const jsonData = xlsx.utils.sheet_to_json(worksheet);

  //     if (worksheetName == 'vaccines') {
  //       // Handle incorrect worksheet name
  //       res.status(400).send("Incorrect worksheet name. Please use 'vaccines'.");
  //       return;
  //     }
  //   } else {
  //     // Handle invalid workbook or other issues
  //     res.status(400).send("Invalid workbook or other issues.");
  //     return;
  //   }
  //   expect(res.status).toHaveBeenCalledWith(400);
  //   expect(res.send).toHaveBeenCalledWith("Incorrect worksheet name. Please use 'vaccines'.");
  // });

});