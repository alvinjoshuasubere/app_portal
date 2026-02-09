<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>Portal Admin Panel</h1>
      <p>Manage systems, desktop apps, quick services, and news</p>
    </header>

    <main class="admin-main">
      <!-- Category Tabs -->
      <div class="category-tabs">
        <button 
          v-for="category in categories" 
          :key="category.key"
          @click="activeCategory = category.key"
          :class="{ active: activeCategory === category.key }"
          class="tab-button"
        >
          <font-awesome-icon :icon="category.icon" />
          {{ category.name }}
        </button>
      </div>

      <!-- Add New Item Form -->
      <section class="add-item-section">
        <h2>{{ isEditing ? 'Edit' : 'Add New' }} {{ getCategoryName(activeCategory) }}</h2>
        <form @submit.prevent="addItem" class="add-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="name">{{ activeCategory === 'latestNews' ? 'Title' : 'Name' }} *</label>
              <input 
                type="text" 
                id="name" 
                v-model="newItem.name" 
                required 
                :placeholder="activeCategory === 'latestNews' ? 'Enter title' : 'Enter name'"
              />
            </div>
            
            <div class="form-group">
              <label for="description">{{ activeCategory === 'latestNews' ? 'Excerpt' : 'Description' }} *</label>
              <textarea 
                id="description" 
                v-model="newItem.description" 
                required 
                :placeholder="activeCategory === 'latestNews' ? 'Enter excerpt' : 'Enter description'"
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="logo">{{ activeCategory === 'latestNews' ? 'Image' : 'Logo' }} Filename</label>
              <input 
                type="file" 
                id="logoFile" 
                @change="handleLogoUpload"
                accept="image/*"
                ref="logoFileInput"
              />
              <input 
                type="text" 
                id="logo" 
                v-model="newItem.logo" 
                :placeholder="activeCategory === 'latestNews' ? 'news-image.jpg' : 'city_logo.png'"
              />
              <small>Upload image or enter filename. Default: {{ activeCategory === 'latestNews' ? 'news-image.jpg' : 'city_logo.png' }}</small>
            </div>
            
            <div class="form-group" v-if="activeCategory !== 'latestNews'">
              <label for="link">Link URL</label>
              <input 
                type="url" 
                id="link" 
                v-model="newItem.link" 
                placeholder="https://example.com"
              />
            </div>
            
            <!-- Category-specific fields -->
            <div class="form-group" v-if="activeCategory === 'quickServices'">
              <label for="icon">Icon Name</label>
              <input 
                type="text" 
                id="icon" 
                v-model="newItem.icon" 
                placeholder="briefcase"
              />
            </div>
            
            <div class="form-group" v-if="activeCategory === 'latestNews'">
              <label for="category">News Category</label>
              <input 
                type="text" 
                id="category" 
                v-model="newItem.category" 
                placeholder="Technology"
              />
            </div>
            
            <div class="form-group" v-if="activeCategory === 'latestNews'">
              <label for="author">Author</label>
              <input 
                type="text" 
                id="author" 
                v-model="newItem.author" 
                placeholder="ICT Division"
              />
            </div>
            
            <div class="form-group" v-if="activeCategory === 'latestNews'">
              <label for="date">Date</label>
              <input 
                type="date" 
                id="date" 
                v-model="newItem.date"
              />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="submitting">
              <font-awesome-icon :icon="isEditing ? 'save' : 'plus'" />
              {{ submitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Item' : 'Add Item') }}
            </button>
            <button 
              v-if="isEditing" 
              type="button" 
              @click="cancelEdit" 
              class="cancel-btn"
            >
              <font-awesome-icon icon="times" />
              Cancel Edit
            </button>
            <button 
              v-else 
              type="button" 
              @click="resetForm" 
              class="reset-btn"
            >
              <font-awesome-icon icon="undo" />
              Reset Form
            </button>
          </div>
        </form>
      </section>

      <!-- Current Items List -->
      <section class="items-list-section">
        <h2>Current {{ getCategoryName(activeCategory) }}</h2>
        <div class="items-grid">
          <div 
            v-for="(item, index) in currentItems" 
            :key="item.id || index"
            class="item-card"
          >
            <div class="item-header">
              <h3>{{ activeCategory === 'latestNews' ? (item.title || item.name) : item.name }}</h3>
             
            </div>
            <p class="item-description">{{ activeCategory === 'latestNews' ? (item.excerpt || item.description) : item.description }}</p>
            <div class="item-details">
              <small v-if="item.link"><strong>Link:</strong> {{ item.link }}</small>
              <small v-if="activeCategory === 'latestNews' ? item.image : item.logo">
                <strong>{{ activeCategory === 'latestNews' ? 'Image' : 'Logo' }}:</strong> 
                {{ activeCategory === 'latestNews' ? item.image : item.logo }}
              </small>
              <small v-if="item.icon"><strong>Icon:</strong> {{ item.icon }}</small>
              <small v-if="item.category"><strong>Category:</strong> {{ item.category }}</small>
              <small v-if="item.author"><strong>Author:</strong> {{ item.author }}</small>
              <small v-if="item.date"><strong>Date:</strong> {{ formatDate(item.date) }}</small>
            </div>
            <div class="item-actions">
              <button @click="editItem(item)" class="edit-btn">
                <font-awesome-icon icon="edit" />
                Edit
              </button>
              <button @click="deleteItem(item, index)" class="delete-btn">
                <font-awesome-icon icon="trash" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminPanel',
  data() {
    return {
      activeCategory: 'systems',
      currentItems: [],
      submitting: false,
      isEditing: false,
      editItemId: null,
      selectedFile: null,
      newItem: {
        name: '',
        description: '',
        logo: 'city_logo.png',
        link: '',
        icon: '',
        category: '',
        author: '',
        date: '',
        isOnline: false
      },
      categories: [
        { key: 'systems', name: 'Web Applications', icon: 'globe' },
        { key: 'desktop', name: 'Desktop Applications', icon: 'desktop' },
        { key: 'quickServices', name: 'Quick Services', icon: 'bolt' },
        { key: 'latestNews', name: 'Latest News', icon: 'newspaper' }
      ]
    };
  },
  mounted() {
    this.loadItems();
  },
  watch: {
    activeCategory() {
      this.loadItems();
      this.resetForm();
    }
  },
  methods: {
    async loadItems() {
      try {
        const response = await fetch('/portal-data.json');
        const data = await response.json();
        this.currentItems = data[this.activeCategory] || [];
      } catch (error) {
        console.error(`Failed to load ${this.activeCategory}:`, error);
        alert('Failed to load items');
      }
    },
    
    handleLogoUpload(event) {
      const file = event.target.files[0];
      
      if (!file) {
        this.newItem.logo = 'city_logo.png';
        this.selectedFile = null;
        console.log('No file selected, using default logo');
        return;
      }

      // Store file for upload when form is submitted
      this.selectedFile = file;
      
      // Preview filename
      this.newItem.logo = file.name;
      console.log('File selected for upload:', file.name);
    },
    
    async addItem() {
      try {
        this.submitting = true;
        
        // Prepare item data
        let itemToAdd = { ...this.newItem };
        
        // Map fields for latest news category
        if (this.activeCategory === 'latestNews') {
          itemToAdd = {
            ...itemToAdd,
            title: itemToAdd.name,
            excerpt: itemToAdd.description,
            image: itemToAdd.logo
          };
          // Remove the old field names
          delete itemToAdd.name;
          delete itemToAdd.description;
          delete itemToAdd.logo;
        }
        
        // Remove empty fields
        Object.keys(itemToAdd).forEach(key => {
          if (itemToAdd[key] === '' || itemToAdd[key] === null) {
            delete itemToAdd[key];
          }
        });
        
        let response;
        let url;
        let method;
        
        if (this.isEditing) {
          // Update existing item
          url = `/api/update-item/${this.activeCategory}/${this.editItemId}`;
          method = 'PUT';
        } else {
          // Add new item
          url = `/api/add-item/${this.activeCategory}`;
          method = 'POST';
        }
        
        // Check if we have a file to upload
        if (this.selectedFile) {
          // Use FormData to send file and item data together
          const formData = new FormData();
          
          // Add file
          formData.append('file', this.selectedFile);
          
          // Add item data as JSON string in 'data' field
          formData.append('data', JSON.stringify(itemToAdd));
          
          // Send with file
          response = await fetch(url, {
            method: method,
            body: formData
          });
        } else {
          // No file, send JSON only
          response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemToAdd)
          });
        }
        
        const result = await response.json();
        
        if (result.success) {
          const message = this.isEditing ? 'Item updated successfully!' : 'Item added successfully to portal-data.json!';
          alert(message);
          this.resetForm();
          this.cancelEdit(); // Reset edit mode
          this.loadItems();
        } else {
          throw new Error(result.error || 'Failed to save item');
        }
        
      } catch (error) {
        console.error('Failed to save item:', error);
        alert('Failed to save item: ' + error.message);
      } finally {
        this.submitting = false;
      }
    },
    
    editItem(item) {
      // Enter edit mode
      this.isEditing = true;
      this.editItemId = item.id;
      
      // Handle field mapping for latest news (reverse mapping)
      let itemToEdit = { ...item };
      if (this.activeCategory === 'latestNews') {
        itemToEdit = {
          ...itemToEdit,
          name: itemToEdit.title || '',
          description: itemToEdit.excerpt || '',
          logo: itemToEdit.image || 'news-image.jpg'
        };
      }
      
      this.newItem = itemToEdit;
      this.selectedFile = null; // Clear any previously selected file
      
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      console.log('Editing item:', item.id);
    },
    
    cancelEdit() {
      // Cancel edit mode
      this.isEditing = false;
      this.editItemId = null;
      this.resetForm();
      
      console.log('Edit cancelled');
    },
    
    async deleteItem(item, index) {
      const itemName = this.activeCategory === 'latestNews' ? (item.title || item.name) : item.name;
      if (!confirm(`Are you sure you want to delete "${itemName}"?`)) {
        return;
      }
      
      try {
        // Send delete request to server
        const response = await fetch(`/api/delete-item/${this.activeCategory}/${item.id}`, {
          method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
          alert('Item deleted successfully from portal-data.json!');
          this.loadItems();
        } else {
          throw new Error(result.error || 'Failed to delete item');
        }
        
      } catch (error) {
        console.error('Failed to delete item:', error);
        alert('Failed to delete item: ' + error.message);
      }
    },
    
    resetForm() {
      this.newItem = {
        name: '',
        description: '',
        logo: 'city_logo.png',
        link: '',
        icon: '',
        category: '',
        author: '',
        date: '',
        isOnline: false
      };
      
      // Clear selected file
      this.selectedFile = null;
      
      // Reset file input
      if (this.$refs.logoFileInput) {
        this.$refs.logoFileInput.value = '';
      }
    },
    
    getCategoryName(key) {
      const category = this.categories.find(cat => cat.key === key);
      return category ? category.name : key;
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    }
  }
};
</script>

<style scoped lang="scss">
.admin-container {
  min-height: 100vh;
  background: #f8fafc;
  padding: 20px;
}

.admin-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.admin-header h1 {
  color: #1e3a8b;
  margin-bottom: 10px;
  font-size: 2.5rem;
}

.admin-header p {
  color: #64748b;
  font-size: 1.1rem;
}

.admin-main {
  max-width: 1200px;
  margin: 0 auto;
}

.category-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.tab-button {
  padding: 12px 20px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #64748b;
}

.tab-button:hover {
  border-color: #1e3a8b;
  color: #1e3a8b;
}

.tab-button.active {
  background: #1e3a8b;
  color: white;
  border-color: #1e3a8b;
}

.add-item-section, .items-list-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.add-item-section h2, .items-list-section h2 {
  color: #1e3a8b;
  margin-bottom: 25px;
  font-size: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group input, .form-group textarea {
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.form-group input[type="file"] {
  padding: 8px;
  margin-bottom: 8px;
}

.form-group small {
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: #1e3a8b;
}

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.submit-btn, .reset-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-btn {
  background: #1e3a8b;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-btn {
  background: #e5e7eb;
  color: #374151;
}

.reset-btn:hover {
  background: #d1d5db;
}

.cancel-btn {
  background: #fee2e2;
  color: #991b1b;
}

.cancel-btn:hover {
  background: #fecaca;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.item-card {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.item-card:hover {
  border-color: #1e3a8b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.item-header h3 {
  color: #1e3a8b;
  margin: 0;
  font-size: 1.1rem;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.online {
  background: #dcfce7;
  color: #166534;
}

.status-badge.offline {
  background: #fef2f2;
  color: #dc2626;
}

.item-description {
  color: #64748b;
  margin-bottom: 15px;
  line-height: 1.5;
}

.item-details {
  margin-bottom: 20px;
}

.item-details small {
  display: block;
  margin-bottom: 5px;
  color: #6b7280;
}

.item-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.edit-btn {
  background: #3b82f6;
  color: white;
}

.edit-btn:hover {
  background: #2563eb;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .admin-container {
    padding: 10px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .items-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .category-tabs {
    justify-content: center;
  }
}
</style>
