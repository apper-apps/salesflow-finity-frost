import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ContactModal from "@/components/organisms/ContactModal";
import ContactTable from "@/components/organisms/ContactTable";
import FilterBuilder from "@/components/organisms/FilterBuilder";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/molecules/SearchBar";
import contactService from "@/services/api/contactService";

const Contacts = () => {
const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showFilterBuilder, setShowFilterBuilder] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const loadContacts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await contactService.getAll();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

useEffect(() => {
if (searchTerm) {
      const filtered = contacts.filter(contact => {
        // Handle both primitive values and lookup field objects
        const name = contact?.name && typeof contact.name === 'object' ? contact.name.Name : contact.name;
        const email = contact?.email && typeof contact.email === 'object' ? contact.email.Name : contact.email;
        const company = contact?.company && typeof contact.company === 'object' ? contact.company.Name : contact.company;
        
        return name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               company?.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchTerm, contacts]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setShowModal(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleViewContact = (contact) => {
    // For now, just show edit modal
    handleEditContact(contact);
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await contactService.delete(contactId);
      setContacts(prev => prev.filter(c => c.Id !== contactId));
      toast.success('Contact deleted successfully');
    } catch (err) {
      toast.error('Failed to delete contact');
    }
  };

  const handleSaveContact = async (contactData) => {
    try {
      setModalLoading(true);
      
      let savedContact;
      if (selectedContact) {
        // Update existing contact
        savedContact = await contactService.update(selectedContact.Id, contactData);
        setContacts(prev => prev.map(c => 
          c.Id === selectedContact.Id ? savedContact : c
        ));
        toast.success('Contact updated successfully');
      } else {
        // Create new contact
        savedContact = await contactService.create(contactData);
        setContacts(prev => [...prev, savedContact]);
        toast.success('Contact created successfully');
      }
      
      setShowModal(false);
      setSelectedContact(null);
    } catch (err) {
      toast.error('Failed to save contact');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedContact(null);
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadContacts} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">
            Manage your contacts and customer relationships
          </p>
        </div>
        <Button 
          icon="Plus" 
          onClick={handleAddContact}
        >
          Add Contact
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search contacts by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
            onClear={handleClearSearch}
/>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            icon="Filter"
            onClick={() => setShowFilterBuilder(true)}
          >
            Filter
          </Button>
          <Button variant="outline" icon="Download">
            Export
          </Button>
        </div>
      </div>

      <ContactTable
        contacts={filteredContacts}
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
        onView={handleViewContact}
        loading={loading}
      />

<ContactModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveContact}
        contact={selectedContact}
        loading={modalLoading}
      />

      <FilterBuilder
        isOpen={showFilterBuilder}
        onClose={() => setShowFilterBuilder(false)}
        onApplyFilter={handleApplyFilters}
        filterType="contacts"
        currentFilters={activeFilters}
      />

      {activeFilters.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} active
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              icon="X"
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const handleApplyFilters = (filters) => {
  setActiveFilters(filters);
  setShowFilterBuilder(false);
  
  if (filters.length === 0) {
    setFilteredContacts(contacts);
    return;
  }
  
  const filtered = contacts.filter(contact => {
    return filters.every(filter => {
      const value = contact[filter.field];
      if (!value) return false;
      
      switch (filter.operator) {
        case 'equals':
          return value.toString().toLowerCase() === filter.value.toLowerCase();
        case 'contains':
          return value.toString().toLowerCase().includes(filter.value.toLowerCase());
        case 'startsWith':
          return value.toString().toLowerCase().startsWith(filter.value.toLowerCase());
        case 'endsWith':
          return value.toString().toLowerCase().endsWith(filter.value.toLowerCase());
        default:
          return true;
      }
    });
  });
  
  setFilteredContacts(filtered);
};

const handleClearFilters = () => {
  setActiveFilters([]);
  setFilteredContacts(contacts);
};

export default Contacts;