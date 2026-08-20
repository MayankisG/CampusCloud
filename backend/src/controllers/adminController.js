const prisma = require('../config/prisma');
const csv = require('csv-parser');
const stream = require('stream');

const uploadDetailsOfStudentsBulk = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json("No file uploaded");

    const results = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    bufferStream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          // data contains rows from CSV. Map them to student data.
          let count = 0;
          for (const row of results) {
            // Adjust mapping according to CSV structure
            // We assume column names match the model or we adapt them
            if (!row.email) continue;
            
            await prisma.student.upsert({
              where: { email: row.email },
              update: row,
              create: row
            });
            count++;
          }
          res.status(200).json(`Uploaded ${count} students successfully`);
        } catch (error) {
          res.status(500).json(error.message);
        }
      });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const uploadStudentDetail = async (req, res) => {
  try {
    const studentData = req.body;
    if (!studentData.name) return res.status(400).json("Name is required");
    if (!studentData.email) return res.status(400).json("Email is required");

    const newStudent = await prisma.student.create({
      data: studentData
    });
    res.status(200).json(newStudent);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const uploadFacultyDetail = async (req, res) => {
  try {
    const facultyData = req.body;
    const newFaculty = await prisma.faculty.create({
      data: facultyData
    });
    res.status(200).json(newFaculty);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getStudentByRollNo = async (req, res) => {
  try {
    const { rollNo } = req.params;
    const student = await prisma.student.findFirst({
      where: { rollNo }
    });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateStudent = async (req, res) => {
  try {
    const { rollNo } = req.params;
    const data = req.body;
    const student = await prisma.student.updateMany({
      where: { rollNo },
      data: data
    });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { rollNo } = req.params;
    const deleted = await prisma.student.deleteMany({
      where: { rollNo }
    });
    if (deleted.count > 0) {
      res.status(200).json("Deleted");
    } else {
      res.status(404).json("Student not found");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getFacultyByUnivId = async (req, res) => {
  try {
    const { emailId } = req.params;
    const faculty = await prisma.faculty.findUnique({
      where: { email: emailId }
    });
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateFaculty = async (req, res) => {
  try {
    const { emailId } = req.params;
    const data = req.body;
    const faculty = await prisma.faculty.update({
      where: { email: emailId },
      data: data
    });
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const { emailId } = req.params;
    await prisma.faculty.delete({
      where: { email: emailId }
    });
    res.status(200).json(true);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  uploadDetailsOfStudentsBulk,
  uploadStudentDetail,
  uploadFacultyDetail,
  getStudentByRollNo,
  updateStudent,
  deleteStudent,
  getFacultyByUnivId,
  updateFaculty,
  deleteFaculty
};
