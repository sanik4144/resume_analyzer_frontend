import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_BASE_URL = rawBaseURL.endsWith('/') ? rawBaseURL.slice(0, -1) : rawBaseURL;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px 40px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled.div`
  margin-bottom: 30px;
  h1 {
    font-size: 2rem;
    font-weight: 500;
    color: var(--text-main);
  }
`;

const TopSection = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const FormCard = styled.div`
  flex: 1;
  min-width: 400px;
  background: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const PDFSection = styled.div`
  flex: 1;
  min-width: 400px;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const CollapsibleHeader = styled.div`
  background: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;

  &:hover { background: rgba(255, 255, 255, 0.05); }

  span { font-size: 14px; font-weight: 500; }
  .file-name { font-size: 13px; color: var(--text-muted); margin-left: 8px; font-weight: 400; }
`;

const Chevron = styled.svg`
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  transition: transform 0.25s ease;
  transform: ${props => props.open ? 'rotate(180deg)' : 'rotate(0)'};
`;

const CollapsibleBody = styled.div`
  overflow: hidden;
  max-height: ${props => props.open ? '800px' : '0'};
  transition: max-height 0.35s ease;
  background: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: none;
  border-radius: 0 0 12px 12px;
`;

const PDFViewer = styled.iframe`
  width: 100%;
  height: 600px;
  border: none;
  display: block;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  label {
    display: block;
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 4px;
  }
  input, textarea {
    width: 100%;
    padding: 10px 12px;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--text-main);
    font-size: 14px;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: var(--primary);
    }
  }
  textarea { resize: vertical; }
`;

const Button = styled.button`
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:hover:not(:disabled) { opacity: 0.9; }
`;

const ResultsSection = styled.div`
  display: ${props => props.visible ? 'block' : 'none'};
`;

const Metrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

const MetricCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  .label { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
  .value { font-size: 32px; font-weight: 600; color: ${props => props.color || 'var(--text-main)'}; }
`;

const ProgressBar = styled.div`
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-top: 12px;
  overflow: hidden;

  div {
    height: 100%;
    background: ${props => props.color || 'var(--primary)'};
    width: ${props => props.width || 0}%;
    transition: width 1s ease-out;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;

  h3 {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 12px;
  }
`;

const WideCard = styled(Card)`
  grid-column: span 2;
  margin-bottom: 24px;
`;

const List = styled.ul`
  list-style: none;
  li {
    font-size: 14px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: var(--text-main);
    &:last-child { border-bottom: none; }
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const Tag = styled.span`
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 999px;
  background: ${props => props.bgColor || 'rgba(99, 102, 241, 0.1)'};
  color: ${props => props.textColor || 'var(--primary)'};
`;

const SectionTitle = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 32px 0 16px;
  color: var(--text-main);
`;

const ResourceBlock = styled.div`
  margin-bottom: 16px;
  .skill-name { font-size: 14px; font-weight: 500; margin-bottom: 6px; color: var(--accent); }
  .resource-item {
    font-size: 13px;
    color: var(--text-muted);
    padding: 4px 0 4px 12px;
    border-left: 2px solid rgba(255, 255, 255, 0.1);
  }
`;

const Analyzer = () => {
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [formData, setFormData] = useState({
    JOB_ROLE: '',
    JOB_DESCRIPTION: '',
    JOB_RESPONSIBILITIES: '',
    DEADLINE: '',
    EXPERIENCE_WANTED: '',
    REQUIRED_SKILLS: '',
    SPECIAL_NOTES: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewURL(url);
      setPdfOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload your CV (PDF) first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const data = new FormData();
    data.append('cvFile', file);
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, data);
      if (response.data.success) {
        setResult(response.data.reply);
      } else {
        throw new Error(response.data.message || "Analysis failed");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetPage = () => {
    setResult(null);
    setFile(null);
    setPreviewURL(null);
    setPdfOpen(false);
    setFormData({
      JOB_ROLE: '',
      JOB_DESCRIPTION: '',
      JOB_RESPONSIBILITIES: '',
      DEADLINE: '',
      EXPERIENCE_WANTED: '',
      REQUIRED_SKILLS: '',
      SPECIAL_NOTES: ''
    });
  };

  return (
    <Container>
      <Header>
        <h1>Resume analyzer</h1>
      </Header>

      {!result && (
        <TopSection>
          <FormCard>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <label>Upload CV (PDF)</label>
                <input type="file" accept="application/pdf" onChange={handleFileChange} required />
              </FormGroup>
              
              <FormGroup>
                <label>Job role</label>
                <input name="JOB_ROLE" placeholder="e.g. Frontend Developer" value={formData.JOB_ROLE} onChange={handleInputChange} required />
              </FormGroup>

              <FormGroup>
                <label>Job description</label>
                <textarea name="JOB_DESCRIPTION" rows="3" placeholder="Paste the job description..." value={formData.JOB_DESCRIPTION} onChange={handleInputChange} required />
              </FormGroup>

              <FormGroup>
                <label>Job responsibilities</label>
                <textarea name="JOB_RESPONSIBILITIES" rows="3" value={formData.JOB_RESPONSIBILITIES} onChange={handleInputChange} required />
              </FormGroup>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <FormGroup>
                  <label>Deadline</label>
                  <input type="date" name="DEADLINE" value={formData.DEADLINE} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                  <label>Experience wanted</label>
                  <input name="EXPERIENCE_WANTED" placeholder="e.g. 2+ years" value={formData.EXPERIENCE_WANTED} onChange={handleInputChange} />
                </FormGroup>
              </div>

              <FormGroup>
                <label>Required skills</label>
                <input name="REQUIRED_SKILLS" placeholder="e.g. React, Node.js" value={formData.REQUIRED_SKILLS} onChange={handleInputChange} />
              </FormGroup>

              <FormGroup>
                <label>Special notes</label>
                <textarea name="SPECIAL_NOTES" rows="2" value={formData.SPECIAL_NOTES} onChange={handleInputChange} />
              </FormGroup>

              <Button type="submit" disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze resume'}
              </Button>
            </form>
            {loading && <p style={{ marginTop: 10, fontSize: 13, color: 'var(--text-muted)' }}>Analyzing your resume — this may take a moment...</p>}
            {error && <p style={{ marginTop: 10, color: 'var(--error)', fontSize: 13 }}>{error}</p>}
          </FormCard>

          <PDFSection visible={!!previewURL}>
            <CollapsibleHeader onClick={() => setPdfOpen(!pdfOpen)}>
              <div>
                <span>Uploaded CV</span>
                <span className="file-name">{file?.name}</span>
              </div>
              <Chevron open={pdfOpen} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </Chevron>
            </CollapsibleHeader>
            <CollapsibleBody open={pdfOpen}>
              <PDFViewer src={previewURL} title="CV preview" />
            </CollapsibleBody>
          </PDFSection>
        </TopSection>
      )}

      {result && (
        <ResultsSection visible={true}>
          <Metrics>
            <MetricCard color="#639922">
              <div className="label">ATS score</div>
              <div className="value">{result.ats_score}/100</div>
              <ProgressBar color="#639922" width={result.ats_score}><div /></ProgressBar>
            </MetricCard>
            <MetricCard color="#185FA5">
              <div className="label">Job match</div>
              <div className="value">{result.job_match_percentage}%</div>
              <ProgressBar color="#185FA5" width={result.job_match_percentage}><div /></ProgressBar>
            </MetricCard>
          </Metrics>

          <CardGrid>
            <Card>
              <h3>Strengths</h3>
              <List>
                {result.strengths?.map((s, i) => <li key={i}>{s}</li>)}
              </List>
            </Card>
            <Card>
              <h3>Gaps</h3>
              <List>
                {result.gaps?.map((g, i) => <li key={i}>{g}</li>)}
              </List>
            </Card>
            
            <SectionTitle style={{ gridColumn: 'span 2' }}>CV improvements</SectionTitle>
            <WideCard>
              <List>
                {result.places_to_upgrade_in_cv?.map((item, i) => <li key={i}>{item}</li>)}
              </List>
            </WideCard>

            <SectionTitle style={{ gridColumn: 'span 2' }}>Missing keywords</SectionTitle>
            <div style={{ gridColumn: 'span 2' }}>
              <TagList>
                {result.missing_keywords?.map((k, i) => <Tag key={i} bgColor="rgba(239, 68, 68, 0.1)" textColor="#ef4444">{k}</Tag>)}
              </TagList>
            </div>

            <SectionTitle style={{ gridColumn: 'span 2' }}>Skills to learn</SectionTitle>
            <div style={{ gridColumn: 'span 2' }}>
              <TagList>
                {result.skills_to_learn?.map((s, i) => <Tag key={i} bgColor="rgba(34, 211, 238, 0.1)" textColor="#22d3ee">{s}</Tag>)}
              </TagList>
            </div>

            <SectionTitle style={{ gridColumn: 'span 2' }}>Learning resources</SectionTitle>
            <WideCard>
              {result.learning_resources?.map((r, i) => (
                <ResourceBlock key={i}>
                  <div className="skill-name">{r.skill}</div>
                  {r.resources?.map((res, j) => <div className="resource-item" key={j}>{res}</div>)}
                </ResourceBlock>
              ))}
            </WideCard>

            <SectionTitle style={{ gridColumn: 'span 2' }}>Suggestions</SectionTitle>
            <WideCard>
              <List>
                {result.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
              </List>
            </WideCard>
          </CardGrid>

          <div style={{ marginTop: '24px' }}>
            <Button onClick={resetPage}>Analyze another</Button>
          </div>
        </ResultsSection>
      )}
    </Container>
  );
};

export default Analyzer;
