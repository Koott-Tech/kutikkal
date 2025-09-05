// Utility function to check if client contact information is complete
export const isClientContactComplete = (clientProfile) => {
  if (!clientProfile) return false;
  
  const requiredFields = ['first_name', 'last_name', 'phone_number', 'child_name', 'child_age'];
  
  return requiredFields.every(field => {
    const value = clientProfile[field];
    return value && value.toString().trim() !== '' && value !== 'Pending' && value !== 'Update';
  });
};

// Utility function to get incomplete contact fields
export const getIncompleteContactFields = (clientProfile) => {
  if (!clientProfile) return ['first_name', 'last_name', 'phone_number', 'child_name', 'child_age'];
  
  const requiredFields = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'phone_number', label: 'Phone Number' },
    { key: 'child_name', label: 'Child Name' },
    { key: 'child_age', label: 'Child Age' }
  ];
  
  return requiredFields.filter(field => {
    const value = clientProfile[field.key];
    return !value || value.toString().trim() === '' || value === 'Pending' || value === 'Update';
  });
};
