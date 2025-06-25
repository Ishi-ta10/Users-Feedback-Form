import React, { useState } from 'react';
import { Form, Button, Row, Col, Image, Spinner, ProgressBar, Card, Tab, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { uploadImage } from '../../services/uploadService';
import './FeedbackForm.css';

// Validation schema
const validationSchema = Yup.object({
  title: Yup.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  category: Yup.string()
    .required('Category is required')
});

const FeedbackForm = ({ 
  initialValues = { title: '', description: '', category: '', image: { url: '', public_id: '' } }, 
  onSubmit, 
  categories = [],
  isEditing = false 
}) => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialValues.image?.url || '');
  const [imageUploadError, setImageUploadError] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  
  // Handle image file selection
  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    setImageUploadError('');
    
    if (!file) {
      setImageFile(null);
      setImagePreview('');
      setFieldValue('image', { url: '', public_id: '' });
      return;
    }

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!validImageTypes.includes(file.type)) {
      setImageUploadError('Please select a valid image file (JPG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    
    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Get step progress percentage
  const getProgress = () => {
    if (showPreview) return 100;
    return activeStep * 33.33;
  };

  // Render tooltip for help icons
  const renderTooltip = (content) => (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {content}
    </Tooltip>
  );

  return (
    <div className="feedback-form-container">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, formikBag) => {
          try {
            if (imageFile && !values.image.url) {
              // Upload the image first if we have a file but no URL yet
              setUploadingImage(true);
              setImageUploadError('');
              
              try {
                const formData = new FormData();
                formData.append('image', imageFile);
                
                const response = await uploadImage(formData);
                
                if (response.success) {
                  // Update values with the uploaded image info
                  values.image = {
                    url: response.data.url,
                    public_id: response.data.public_id
                  };
                } else {
                  setImageUploadError('Failed to upload image. Please try again.');
                  formikBag.setSubmitting(false);
                  return;
                }
              } catch (error) {
                console.error('Error uploading image:', error);
                setImageUploadError('Failed to upload image. Please try again.');
                formikBag.setSubmitting(false);
                return;
              } finally {
                setUploadingImage(false);
              }
            }
            
            // Now submit the feedback with the updated values
            await onSubmit(values, formikBag);
          } catch (error) {
            console.error('Error in form submission:', error);
            formikBag.setSubmitting(false);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue
        }) => (
          <Form onSubmit={handleSubmit}>
            {/* Progress Tracker */}
            <div className="form-progress-container mb-4">
              <ProgressBar 
                now={getProgress()} 
                variant="primary" 
                className="form-progress"
                animated
              />
              <div className="steps-indicator d-flex justify-content-between mt-2">
                <div className={`step ${activeStep >= 1 ? 'active' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-label d-none d-md-inline">Title</span>
                </div>
                <div className={`step ${activeStep >= 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-label d-none d-md-inline">Details</span>
                </div>
                <div className={`step ${activeStep >= 3 ? 'active' : ''}`}>
                  <span className="step-number">3</span>
                  <span className="step-label d-none d-md-inline">Category</span>
                </div>
                <div className={`step ${showPreview ? 'active' : ''}`}>
                  <span className="step-number">4</span>
                  <span className="step-label d-none d-md-inline">Preview</span>
                </div>
              </div>
            </div>

            {/* Main Form Content */}
            {!showPreview ? (
              <div className="form-steps">
                {/* Step 1: Title */}
                {activeStep === 1 && (
                  <div className="form-step step-1 animate__animated animate__fadeIn">
                    <h4 className="step-title">Give your feedback a title</h4>
                    <p className="text-muted">Create a clear, descriptive title for your feedback</p>
                    
                    <Form.Group className="mb-4">
                      <div className="d-flex align-items-center">
                        <Form.Label className="mb-2">Title</Form.Label>
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltip("A good title is concise and descriptive. Think of it as a newspaper headline.")}
                        >
                          <i className="fas fa-question-circle ms-2 text-muted"></i>
                        </OverlayTrigger>
                      </div>
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="e.g., 'Add dark mode to the dashboard'"
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.title && errors.title}
                        className="title-input"
                        autoFocus
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.title}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Be specific and concise
                      </Form.Text>
                      
                      <div className="title-length-indicator mt-2">
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">Title length: {values.title.length}/100</small>
                          <small className={values.title.length < 5 ? 'text-danger' : 'text-success'}>
                            {values.title.length < 5 ? 'Too short' : 'Good length'}
                          </small>
                        </div>
                        <ProgressBar 
                          now={Math.min(100, values.title.length * 2)} 
                          variant={values.title.length < 5 ? 'danger' : 'success'} 
                          className="mt-1"
                          style={{ height: '4px' }}
                        />
                      </div>
                    </Form.Group>
                    
                    <div className="d-flex justify-content-end mt-4">
                      <Button 
                        variant="primary" 
                        onClick={() => setActiveStep(2)} 
                        disabled={!values.title || (touched.title && errors.title)}
                        className="px-4 next-btn"
                      >
                        Next <i className="fas fa-arrow-right ms-2"></i>
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Description and Image */}
                {activeStep === 2 && (
                  <div className="form-step step-2 animate__animated animate__fadeIn">
                    <h4 className="step-title">Describe your feedback in detail</h4>
                    <p className="text-muted">Provide all the necessary details to help us understand your feedback</p>
                    
                    <Form.Group className="mb-4">
                      <div className="d-flex align-items-center">
                        <Form.Label className="mb-2">Description</Form.Label>
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltip("Be detailed but concise. Include steps to reproduce if it's a bug.")}
                        >
                          <i className="fas fa-question-circle ms-2 text-muted"></i>
                        </OverlayTrigger>
                      </div>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="description"
                        placeholder="Describe your feedback in detail. What problem are you trying to solve? Why is this important?"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.description && errors.description}
                        className="description-input"
                        autoFocus
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Include all the information someone would need to understand your feedback
                      </Form.Text>
                      
                      <div className="description-length-indicator mt-2">
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">Description length: {values.description.length} characters</small>
                          <small className={values.description.length < 10 ? 'text-danger' : 'text-success'}>
                            {values.description.length < 10 ? 'Too short' : 'Good length'}
                          </small>
                        </div>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <div className="d-flex align-items-center">
                        <Form.Label className="mb-2">Image (Optional)</Form.Label>
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltip("Screenshots or images help clarify your feedback.")}
                        >
                          <i className="fas fa-question-circle ms-2 text-muted"></i>
                        </OverlayTrigger>
                      </div>
                      <div className="image-upload-container">
                        {!imagePreview ? (
                          <div className="image-upload-dropzone">
                            <Form.Control
                              type="file"
                              accept="image/*"
                              id="imageUpload"
                              className="image-upload-input"
                              onChange={(e) => handleImageChange(e, setFieldValue)}
                            />
                            <label htmlFor="imageUpload" className="image-upload-label">
                              <i className="fas fa-cloud-upload-alt upload-icon"></i>
                              <div className="upload-text">
                                <span>Drag & drop an image or click to browse</span>
                                <small className="text-muted d-block mt-1">Supports JPG, PNG, GIF (max 5MB)</small>
                              </div>
                            </label>
                          </div>
                        ) : (
                          <div className="mt-3 image-preview-container">
                            <div className="image-preview-wrapper">
                              <Image 
                                src={imagePreview} 
                                alt="Preview" 
                                className="image-preview"
                              />
                              <Button 
                                variant="danger" 
                                size="sm"
                                className="remove-image-btn"
                                onClick={() => {
                                  setImageFile(null);
                                  setImagePreview('');
                                  setFieldValue('image', { url: '', public_id: '' });
                                }}
                              >
                                <i className="fas fa-times"></i>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {imageUploadError && (
                        <div className="text-danger mt-2">{imageUploadError}</div>
                      )}
                      {uploadingImage && (
                        <div className="mt-2 d-flex align-items-center">
                          <Spinner animation="border" size="sm" className="me-2" /> 
                          <span>Uploading image...</span>
                        </div>
                      )}
                    </Form.Group>
                    
                    <div className="d-flex justify-content-between mt-4">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setActiveStep(1)}
                        className="px-4"
                      >
                        <i className="fas fa-arrow-left me-2"></i> Back
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => setActiveStep(3)} 
                        disabled={!values.description || (touched.description && errors.description)}
                        className="px-4 next-btn"
                      >
                        Next <i className="fas fa-arrow-right ms-2"></i>
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Category */}
                {activeStep === 3 && (
                  <div className="form-step step-3 animate__animated animate__fadeIn">
                    <h4 className="step-title">Select a category for your feedback</h4>
                    <p className="text-muted">Choose the category that best matches your feedback</p>
                    
                    <Form.Group className="mb-4">
                      <div className="d-flex align-items-center">
                        <Form.Label className="mb-2">Category</Form.Label>
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltip("Selecting the right category helps route your feedback to the right team.")}
                        >
                          <i className="fas fa-question-circle ms-2 text-muted"></i>
                        </OverlayTrigger>
                      </div>
                      <div className="category-selector">
                        <Row className="g-3">
                          {categories.map(category => (
                            <Col xs={12} sm={6} md={4} key={category._id}>
                              <div 
                                className={`category-card ${values.category === category._id ? 'selected' : ''}`}
                                onClick={() => setFieldValue('category', category._id)}
                              >
                                <div className="category-icon">
                                  <i className={`fas fa-${getCategoryIcon(category.name)}`}></i>
                                </div>
                                <div className="category-info">
                                  <div className="category-name">{category.name}</div>
                                  <small className="category-description text-muted">
                                    {getCategoryDescription(category.name)}
                                  </small>
                                </div>
                                {values.category === category._id && (
                                  <div className="category-selected-badge">
                                    <i className="fas fa-check-circle"></i>
                                  </div>
                                )}
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                      
                      {touched.category && errors.category && (
                        <div className="text-danger mt-2">{errors.category}</div>
                      )}
                    </Form.Group>
                    
                    <div className="d-flex justify-content-between mt-4">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setActiveStep(2)}
                        className="px-4"
                      >
                        <i className="fas fa-arrow-left me-2"></i> Back
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => setShowPreview(true)} 
                        disabled={!values.category || (touched.category && errors.category)}
                        className="px-4 next-btn"
                      >
                        Preview <i className="fas fa-eye ms-2"></i>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Preview Step */
              <div className="form-step step-preview animate__animated animate__fadeIn">
                <h4 className="step-title">Preview your feedback</h4>
                <p className="text-muted">Review your feedback before submitting</p>
                
                <Card className="feedback-preview">
                  <Card.Header className="d-flex align-items-center">
                    <div className="preview-category-badge">
                      {getCategoryName(values.category, categories)}
                    </div>
                    <h5 className="mb-0 ms-2">{values.title}</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="preview-description mb-3">
                      {values.description.split('\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                    
                    {imagePreview && (
                      <div className="preview-image-container mb-3">
                        <Image 
                          src={imagePreview} 
                          alt="Feedback image" 
                          className="preview-image" 
                        />
                      </div>
                    )}
                  </Card.Body>
                </Card>
                
                <div className="d-flex justify-content-between mt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setShowPreview(false)}
                    className="px-4"
                  >
                    <i className="fas fa-arrow-left me-2"></i> Edit
                  </Button>
                  <Button 
                    variant="success" 
                    type="submit" 
                    className="px-4 submit-btn"
                    disabled={isSubmitting || uploadingImage}
                  >
                    {isSubmitting || uploadingImage
                      ? <><Spinner animation="border" size="sm" className="me-2" /> {isEditing ? 'Updating...' : 'Submitting...'}</>
                      : <><i className="fas fa-paper-plane me-2"></i> {isEditing ? 'Update Feedback' : 'Submit Feedback'}</>}
                  </Button>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

// Helper functions for category icons and descriptions
const getCategoryIcon = (categoryName) => {
  const icons = {
    'Bug Report': 'bug',
    'Feature Request': 'lightbulb',
    'UI/UX': 'palette',
    'Performance': 'tachometer-alt',
    'Documentation': 'book',
    'Security': 'shield-alt',
    'Question': 'question-circle',
    'Other': 'ellipsis-h'
  };
  
  return icons[categoryName] || 'tag';
};

const getCategoryDescription = (categoryName) => {
  const descriptions = {
    'Bug Report': 'Report a problem or error',
    'Feature Request': 'Suggest a new feature',
    'UI/UX': 'Improvements to user interface',
    'Performance': 'Speed or resource usage issues',
    'Documentation': 'Help or documentation issues',
    'Security': 'Security concerns or vulnerabilities',
    'Question': 'General questions about the system',
    'Other': 'Feedback that doesn\'t fit elsewhere'
  };
  
  return descriptions[categoryName] || 'Feedback category';
};

const getCategoryName = (categoryId, categories) => {
  const category = categories.find(cat => cat._id === categoryId);
  return category ? category.name : 'Unknown Category';
};

export default FeedbackForm;
