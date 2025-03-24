const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
app.use(cors({}));

const upload = multer({ dest: 'uploads/' });

const processCSV = (filePath) => {
    return new Promise((resolve) => {
        const results = [];
        const quarterlyData = { Q1: [], Q2: [], Q3: [], Q4: [] };

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Validate numerical fields
                const sanitizedRow = {
                    Date: row.Date,
                    Product: row.Product,
                    Region: row.Region,
                    Sales: Number(row.Sales) || 0,
                    Profit: Number(row.Profit) || 0
                };
                const date = new Date(row.Date).getMonth()
                const quarter = `Q${Math.floor((date + 3) / 3)}`;
                results.push(row);
                quarterlyData[quarter].push(sanitizedRow);
            })
            .on('end', () => {
                fs.unlinkSync(filePath);
                resolve({ rawData: results, quarterlyData });
            });
    });
};

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const data = await processCSV(req.file.path);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error processing file');
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));