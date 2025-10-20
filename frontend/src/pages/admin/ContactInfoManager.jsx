import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { MapPin, Phone, Mail, Clock, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { getContactInfo, updateContactInfo } from '../../features/admin/adminAPI';

const ContactInfoManager = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await getContactInfo();
      setContactInfo(response.data.contactInfo);
    } catch (error) {
      console.error('Failed to fetch contact info:', error);
      // Initialize with empty structure if no data exists
      setContactInfo({
        address: {
          street: '',
          city: '',
          state: '',
          pincode: '',
          country: ''
        },
        phoneNumbers: [{ number: '', label: '' }],
        emailAddresses: [{ email: '', label: '' }],
        businessHours: [
          { day: 'monday', hours: '', isOpen: true },
          { day: 'tuesday', hours: '', isOpen: true },
          { day: 'wednesday', hours: '', isOpen: true },
          { day: 'thursday', hours: '', isOpen: true },
          { day: 'friday', hours: '', isOpen: true },
          { day: 'saturday', hours: '', isOpen: true },
          { day: 'sunday', hours: '', isOpen: false }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    address: Yup.object({
      street: Yup.string().required('Street address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      pincode: Yup.string().matches(/^\d{6}$/, 'Pincode must be 6 digits').required('Pincode is required'),
      country: Yup.string().required('Country is required'),
    }),
    phoneNumbers: Yup.array().of(
      Yup.object({
        number: Yup.string().required('Phone number is required'),
        label: Yup.string(),
      })
    ),
    emailAddresses: Yup.array().of(
      Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        label: Yup.string(),
      })
    ),
    businessHours: Yup.array().of(
      Yup.object({
        day: Yup.string().required('Day is required'),
        hours: Yup.string().required('Hours are required'),
        isOpen: Yup.boolean(),
      })
    ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSaving(true);
    try {
      await updateContactInfo(values);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await fetchContactInfo(); // Refresh data
    } catch (error) {
      alert(error.message || 'Failed to update contact information');
    } finally {
      setSaving(false);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Information Manager</h1>
          <p className="text-gray-600">Manage the contact details displayed on the Contact Us page</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-green-800 font-medium">Contact information updated successfully!</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <Formik
            initialValues={contactInfo}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, isSubmitting }) => (
              <Form className="space-y-8">
                {/* Address Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <Field
                        name="address.street"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123 Print Street, Design Colony"
                      />
                      <ErrorMessage
                        name="address.street"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <Field
                        name="address.city"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Mumbai"
                      />
                      <ErrorMessage
                        name="address.city"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <Field
                        name="address.state"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Maharashtra"
                      />
                      <ErrorMessage
                        name="address.state"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode
                      </label>
                      <Field
                        name="address.pincode"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="400001"
                      />
                      <ErrorMessage
                        name="address.pincode"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <Field
                        name="address.country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="India"
                      />
                      <ErrorMessage
                        name="address.country"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Numbers */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Phone Numbers</h3>
                  </div>
                  <FieldArray name="phoneNumbers">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {values.phoneNumbers.map((phone, index) => (
                          <div key={`phone-${index}`} className="flex gap-2">
                            <Field
                              name={`phoneNumbers.${index}.number`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="+91 12345 67890"
                            />
                            <Field
                              name={`phoneNumbers.${index}.label`}
                              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Label"
                            />
                            {values.phoneNumbers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push({ number: '', label: '' })}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          <Plus className="w-4 h-4" />
                          Add Phone Number
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Email Addresses */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Email Addresses</h3>
                  </div>
                  <FieldArray name="emailAddresses">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {values.emailAddresses.map((email, index) => (
                          <div key={`email-${index}`} className="flex gap-2">
                            <Field
                              name={`emailAddresses.${index}.email`}
                              type="email"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="support@teenprintweb.com"
                            />
                            <Field
                              name={`emailAddresses.${index}.label`}
                              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Label"
                            />
                            {values.emailAddresses.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push({ email: '', label: '' })}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          <Plus className="w-4 h-4" />
                          Add Email Address
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Business Hours */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
                  </div>
                  <FieldArray name="businessHours">
                    {({ push, remove }) => (
                      <div className="space-y-3">
                        {values.businessHours.map((hour, index) => (
                          <div key={`business-hour-${hour.day}-${index}`} className="flex gap-2 items-center">
                            <div className="w-32">
                              <span className="text-sm font-medium text-gray-700 capitalize">
                                {hour.day}
                              </span>
                            </div>
                            <Field
                              name={`businessHours.${index}.hours`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="9:00 AM - 6:00 PM"
                            />
                            <label className="flex items-center gap-2">
                              <Field
                                name={`businessHours.${index}.isOpen`}
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">Open</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting || saving}
                    className="btn-primary flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoManager;
