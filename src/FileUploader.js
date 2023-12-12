import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PrettyPrintJson = ({ data }) => (
  <div>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);

const SingleFileUploader = () => {
  const [file, setFile] = useState();
  const [error, setError] = useState();
  const [data, setData] = useState();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    setError(null);
    setData(null);
    try {
      let formData = new FormData();
      formData.append('file', file);
      console.log('>> formData >> ', formData);
      const { data } = await axios.post('http://localhost:4000/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(data);
    } catch (error) {
      setData(null);
      setError('Prüfe Konsole und Logs für Details');
      console.error(error);
    }
  };

  return (
    <>
      <Card sx={{ width: 900 }}>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Typography variant="h4">RBA Importer Tool</Typography>
              <div>
                <label htmlFor="file" className="sr-only">
                  Datei auswählen
                </label>
              </div>
              <div>
                <input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
              </div>
            </div>
            {file && (
              <section>
                File details:
                <ul>
                  <li>Name: {file.name}</li>
                  <li>Type: {file.type}</li>
                  <li>Size: {file.size} bytes</li>
                </ul>
              </section>
            )}
            {file && (
              <div>
                <button onClick={handleUpload}>Runbooks importieren</button>
              </div>
            )}
            {error && (
              <Alert
                severity="error"
                onClose={() => {
                  setError(null);
                }}
              >
                <AlertTitle>Error</AlertTitle>
                Ein Fehler ist beim Importieren der Runbooks passiert: <b>{error}</b>
              </Alert>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {data && data.validEntries && Array.isArray(data.validEntries) && (
                <div>
                  <Typography variant="h6">Successful Runbooks + Triggers</Typography>
                  <Card>
                    <div style={{ overflowY: 'scroll', height: '250px' }}>
                      {data.validEntries.map((entry) => (
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography>
                                <b>Beschreibung: </b>
                                {entry?.row?.Beschreibung}
                              </Typography>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div style={{ overflowX: 'scroll' }}>
                              {PrettyPrintJson({
                                data: entry,
                              })}
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
              {data && data.invalidEntries && Array.isArray(data.invalidEntries) && (
                <div>
                  <Typography variant="h6">Failed Runbooks + Triggers</Typography>
                  <Card>
                    <div style={{ overflowY: 'scroll', height: '250px' }}>
                      {data.invalidEntries.map((entry) => (
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography>
                                <b>Beschreibung: </b>
                                {entry?.row?.Beschreibung}
                              </Typography>
                              <Typography>
                                <b>Status: </b>
                                {entry?.status}
                              </Typography>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div style={{ overflowX: 'scroll' }}>
                              {PrettyPrintJson({
                                data: entry,
                              })}
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SingleFileUploader;
