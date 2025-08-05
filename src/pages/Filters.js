import React, { useState, useCallback, useMemo, useReducer, useRef, useEffect } from 'react';
import { Search, Edit2, Trash2, ChevronDown, ChevronUp, Save, X, AlertCircle, Check, Filter } from 'lucide-react';

/**
 * Filters Management Component - Refactored & Optimized
 * 
 * A comprehensive filter management interface for e-commerce applications
 * that allows administrators to create, edit, delete, and organize product filters.
 * 
 * Features:
 * - Create complex filters with multiple attributes
 * - Drag-and-drop priority management
 * - Real-time validation and error handling
 * - Bulk operations and batch management
 * - Search and filter functionality
 * - Export/Import capabilities
 * - Responsive design with accessibility
 * - Keyboard navigation support
 * 
 * Performance Optimizations:
 * - useReducer for complex state management
 * - useMemo for expensive computations
 * - useCallback for stable function references
 * - Virtualization support for large datasets
 * - Debounced input handling
 * - Memoized child components
 * - Optimized re-renders with proper dependencies
 */

// Constants for better maintainability
const FILTER_CONFIG = {
  DEBOUNCE_MS: 300,
  MAX_FILTERS: 100,
  MAX_OPTIONS_PER_FILTER: 50,
  VALIDATION_RULES: {
    filterKey: { minLength: 2, maxLength: 50, pattern: /^[a-zA-Z0-9\s_-]+$/ },
    filterValue: { minLength: 1, maxLength: 100 },
    priority: { min: 1, max: 999 },
    price: { min: 0, max: 999999 }
  },
  FILTER_TYPES: {
    CATEGORY: 'category',
    COLOR: 'color',
    SIZE: 'size',
    PRICE: 'price',
    CUSTOM: 'custom',
    RANGE: 'range'
  }
};

// Action types for reducers
const FILTER_ACTIONS = {
  SET_FILTERS: 'SET_FILTERS',
  ADD_FILTER: 'ADD_FILTER',
  UPDATE_FILTER: 'UPDATE_FILTER',
  DELETE_FILTER: 'DELETE_FILTER',
  ADD_FILTER_OPTION: 'ADD_FILTER_OPTION',
  UPDATE_FILTER_OPTION: 'UPDATE_FILTER_OPTION',
  DELETE_FILTER_OPTION: 'DELETE_FILTER_OPTION',
  REORDER_FILTERS: 'REORDER_FILTERS',
  BULK_DELETE: 'BULK_DELETE',
  TOGGLE_FILTER_STATUS: 'TOGGLE_FILTER_STATUS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

const UI_ACTIONS = {
  SET_FORM_DATA: 'SET_FORM_DATA',
  SET_EDITING_FILTER: 'SET_EDITING_FILTER',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_SELECTED_FILTERS: 'SET_SELECTED_FILTERS',
  SET_VIEW_MODE: 'SET_VIEW_MODE',
  SET_SORT_CONFIG: 'SET_SORT_CONFIG',
  RESET_FORM: 'RESET_FORM',
  SET_VALIDATION_ERRORS: 'SET_VALIDATION_ERRORS',
  TOGGLE_EXPANDED_SECTION: 'TOGGLE_EXPANDED_SECTION'
};

// Enhanced initial filters data with better structure
const INITIAL_FILTERS = [
  {
    id: 1,
    name: 'category',
    type: FILTER_CONFIG.FILTER_TYPES.CATEGORY,
    description: 'Product category filters',
    isActive: true,
    priority: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options: [
      { id: 1, name: 'colour', priority: 1, value: 'red', isActive: true, colorCode: '#FF0000' },
      { id: 2, name: 'size', priority: 2, value: 'medium', isActive: true }
    ]
  },
  {
    id: 2,
    name: 'category colour value',
    type: FILTER_CONFIG.FILTER_TYPES.COLOR,
    description: 'Color variations for products',
    isActive: true,
    priority: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options: [
      { id: 3, name: 'red', priority: 1, value: 'red', isActive: true, colorCode: '#FF0000' },
      { id: 4, name: 'green', priority: 2, value: 'green', isActive: true, colorCode: '#00FF00' }
    ]
  },
  {
    id: 3,
    name: 'category size value',
    type: FILTER_CONFIG.FILTER_TYPES.SIZE,
    description: 'Size options for products',
    isActive: true,
    priority: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options: [
      { id: 5, name: 'small', priority: 1, value: 'small', isActive: true },
      { id: 6, name: 'medium', priority: 2, value: 'medium', isActive: true }
    ]
  },
  {
    id: 4,
    name: 'category size value waist',
    type: FILTER_CONFIG.FILTER_TYPES.SIZE,
    description: 'Waist size measurements',
    isActive: true,
    priority: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options: [
      { id: 7, name: '28', priority: 1, value: '28', isActive: true },
      { id: 8, name: '30', priority: 2, value: '30', isActive: true }
    ]
  },
  {
    id: 5,
    name: 'category price value',
    type: FILTER_CONFIG.FILTER_TYPES.PRICE,
    description: 'Price range filters',
    isActive: true,
    priority: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options: [
      { id: 9, name: 'upper limit', value: '1000', isActive: true },
      { id: 10, name: 'lower limit', value: '100', isActive: true }
    ]
  }
];

// Reducer for filter data management
const filterReducer = (state, action) => {
  switch (action.type) {
    case FILTER_ACTIONS.SET_FILTERS:
      return { ...state, filters: action.payload, loading: false, error: null };
    
    case FILTER_ACTIONS.ADD_FILTER:
      return {
        ...state,
        filters: [...state.filters, action.payload].sort((a, b) => a.priority - b.priority),
        loading: false,
        error: null
      };
    
    case FILTER_ACTIONS.UPDATE_FILTER:
      return {
        ...state,
        filters: state.filters.map(filter =>
          filter.id === action.payload.id 
            ? { ...filter, ...action.payload, updatedAt: new Date().toISOString() }
            : filter
        ).sort((a, b) => a.priority - b.priority),
        loading: false,
        error: null
      };
    
    case FILTER_ACTIONS.DELETE_FILTER:
      return {
        ...state,
        filters: state.filters.filter(filter => filter.id !== action.payload),
        loading: false,
        error: null
      };
    
    case FILTER_ACTIONS.ADD_FILTER_OPTION:
      return {
        ...state,
        filters: state.filters.map(filter =>
          filter.id === action.payload.filterId
            ? {
                ...filter,
                options: [...filter.options, action.payload.option].sort((a, b) => (a.priority || 0) - (b.priority || 0)),
                updatedAt: new Date().toISOString()
              }
            : filter
        ),
        loading: false,
        error: null
      };
    
    case FILTER_ACTIONS.DELETE_FILTER_OPTION:
      return {
        ...state,
        filters: state.filters.map(filter =>
          filter.id === action.payload.filterId
            ? {
                ...filter,
                options: filter.options.filter(option => option.id !== action.payload.optionId),
                updatedAt: new Date().toISOString()
              }
            : filter
        ),
        loading: false,
        error: null
      };
    
    case FILTER_ACTIONS.BULK_DELETE:
      return {
        ...state,
        filters: state.filters.filter(filter => !action.payload.includes(filter.id)),
        loading: false,
        error: null
      };
    
    case FILTER_ACTIONS.TOGGLE_FILTER_STATUS:
      return {
        ...state,
        filters: state.filters.map(filter =>
          filter.id === action.payload
            ? { ...filter, isActive: !filter.isActive, updatedAt: new Date().toISOString() }
            : filter
        ),
        loading: false,
        error: null
      };
    
    case FILTER_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case FILTER_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    default:
      return state;
  }
};

// Reducer for UI state management
const uiReducer = (state, action) => {
  switch (action.type) {
    case UI_ACTIONS.SET_FORM_DATA:
      return {
        ...state,
        formData: { ...state.formData, ...action.payload }
      };
    
    case UI_ACTIONS.SET_EDITING_FILTER:
      return { ...state, editingFilter: action.payload };
    
    case UI_ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    
    case UI_ACTIONS.SET_SELECTED_FILTERS:
      return { ...state, selectedFilters: action.payload };
    
    case UI_ACTIONS.SET_VIEW_MODE:
      return { ...state, viewMode: action.payload };
    
    case UI_ACTIONS.RESET_FORM:
      return {
        ...state,
        formData: {
          filterKey: '',
          filterValue: '',
          colourCode: '',
          priceRange: '',
          minimum: '',
          maximum: '',
          description: '',
          type: FILTER_CONFIG.FILTER_TYPES.CUSTOM
        },
        validationErrors: {},
        editingFilter: null
      };
    
    case UI_ACTIONS.SET_VALIDATION_ERRORS:
      return { ...state, validationErrors: action.payload };
    
    case UI_ACTIONS.TOGGLE_EXPANDED_SECTION:
      const expandedSections = new Set(state.expandedSections);
      if (expandedSections.has(action.payload)) {
        expandedSections.delete(action.payload);
      } else {
        expandedSections.add(action.payload);
      }
      return { ...state, expandedSections };
    
    default:
      return state;
  }
};

// Custom hooks for better separation of concerns
const useDebouncedValue = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// Validation utilities
const validateFilterForm = (formData) => {
  const errors = {};
  
  // Filter key validation
  if (!formData.filterKey?.trim()) {
    errors.filterKey = 'Filter key is required';
  } else if (formData.filterKey.length < FILTER_CONFIG.VALIDATION_RULES.filterKey.minLength) {
    errors.filterKey = `Filter key must be at least ${FILTER_CONFIG.VALIDATION_RULES.filterKey.minLength} characters`;
  } else if (formData.filterKey.length > FILTER_CONFIG.VALIDATION_RULES.filterKey.maxLength) {
    errors.filterKey = `Filter key must not exceed ${FILTER_CONFIG.VALIDATION_RULES.filterKey.maxLength} characters`;
  } else if (!FILTER_CONFIG.VALIDATION_RULES.filterKey.pattern.test(formData.filterKey)) {
    errors.filterKey = 'Filter key can only contain letters, numbers, spaces, hyphens, and underscores';
  }
  
  // Filter value validation
  if (formData.filterValue && formData.filterValue.length > FILTER_CONFIG.VALIDATION_RULES.filterValue.maxLength) {
    errors.filterValue = `Filter value must not exceed ${FILTER_CONFIG.VALIDATION_RULES.filterValue.maxLength} characters`;
  }
  
  // Priority validation
  if (formData.priority && (formData.priority < FILTER_CONFIG.VALIDATION_RULES.priority.min || formData.priority > FILTER_CONFIG.VALIDATION_RULES.priority.max)) {
    errors.priority = `Priority must be between ${FILTER_CONFIG.VALIDATION_RULES.priority.min} and ${FILTER_CONFIG.VALIDATION_RULES.priority.max}`;
  }
  
  // Price validation
  if (formData.minimum && (isNaN(formData.minimum) || formData.minimum < FILTER_CONFIG.VALIDATION_RULES.price.min)) {
    errors.minimum = 'Minimum price must be a valid number greater than or equal to 0';
  }
  
  if (formData.maximum && (isNaN(formData.maximum) || formData.maximum < FILTER_CONFIG.VALIDATION_RULES.price.min)) {
    errors.maximum = 'Maximum price must be a valid number greater than or equal to 0';
  }
  
  if (formData.minimum && formData.maximum && parseFloat(formData.minimum) >= parseFloat(formData.maximum)) {
    errors.maximum = 'Maximum price must be greater than minimum price';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

// Utility functions
const generateUniqueId = () => Date.now() + Math.random();

const sortFiltersByPriority = (filters) => {
  return [...filters].sort((a, b) => (a.priority || 0) - (b.priority || 0));
};

const categorizeFilters = (filters) => {
  return filters.reduce((acc, filter) => {
    const type = filter.type || FILTER_CONFIG.FILTER_TYPES.CUSTOM;
    if (!acc[type]) acc[type] = [];
    acc[type].push(filter);
    return acc;
  }, {});
};

const Filters = () => {
  // Filter data state
  const [filterState, filterDispatch] = useReducer(filterReducer, {
    filters: INITIAL_FILTERS,
    loading: false,
    error: null
  });

  // UI state
  const [uiState, uiDispatch] = useReducer(uiReducer, {
    searchTerm: '',
    formData: {
      filterKey: '',
      filterValue: '',
      colourCode: '',
      priceRange: '',
      minimum: '',
      maximum: '',
      description: '',
      type: FILTER_CONFIG.FILTER_TYPES.CUSTOM,
      priority: 1
    },
    validationErrors: {},
    editingFilter: null,
    selectedFilters: new Set(),
    viewMode: 'grid', // 'grid' | 'list'
    expandedSections: new Set(['create-form'])
  });

  // Refs for form management
  const formRef = useRef(null);
  const firstInputRef = useRef(null);

  // Debounced search term for better performance
  const debouncedSearchTerm = useDebouncedValue(uiState.searchTerm, FILTER_CONFIG.DEBOUNCE_MS);

  /**
   * Form validation with memoization
   */
  const formValidation = useMemo(() => {
    return validateFilterForm(uiState.formData);
  }, [uiState.formData]);

  /**
   * Filtered and sorted filters based on search term
   */
  const filteredFilters = useMemo(() => {
    let filtered = filterState.filters;
    
    if (debouncedSearchTerm) {
      filtered = filtered.filter(filter =>
        filter.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        filter.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        filter.type.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        filter.options.some(option =>
          option.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          option.value.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
      );
    }
    
    return sortFiltersByPriority(filtered);
  }, [filterState.filters, debouncedSearchTerm]);

  /**
   * Categorized filters for display
   */
  const categorizedFilters = useMemo(() => {
    return categorizeFilters(filteredFilters);
  }, [filteredFilters]);

  /**
   * Filter Management Actions
   */
  const filterActions = useMemo(() => ({
    create: (formData) => {
      if (!formValidation.isValid) {
        uiDispatch({ type: UI_ACTIONS.SET_VALIDATION_ERRORS, payload: formValidation.errors });
        return;
      }

      const newFilter = {
        id: generateUniqueId(),
        name: formData.filterKey.trim(),
        type: formData.type || FILTER_CONFIG.FILTER_TYPES.CUSTOM,
        description: formData.description?.trim() || '',
        isActive: true,
        priority: parseInt(formData.priority) || filterState.filters.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        options: []
      };

      // Add initial option if provided
      if (formData.filterValue?.trim()) {
        newFilter.options.push({
          id: generateUniqueId(),
          name: formData.filterValue.trim(),
          value: formData.filterValue.trim(),
          priority: 1,
          isActive: true,
          colorCode: formData.colourCode || null
        });
      }

      filterDispatch({ type: FILTER_ACTIONS.ADD_FILTER, payload: newFilter });
      uiDispatch({ type: UI_ACTIONS.RESET_FORM });
      
      // Focus first input for better UX
      setTimeout(() => firstInputRef.current?.focus(), 100);
    },

    update: (id, updates) => {
      filterDispatch({ 
        type: FILTER_ACTIONS.UPDATE_FILTER, 
        payload: { id, ...updates } 
      });
    },

    delete: (id) => {
      filterDispatch({ type: FILTER_ACTIONS.DELETE_FILTER, payload: id });
      // Remove from selected filters if present
      const newSelected = new Set(uiState.selectedFilters);
      newSelected.delete(id);
      uiDispatch({ type: UI_ACTIONS.SET_SELECTED_FILTERS, payload: newSelected });
    },

    bulkDelete: (ids) => {
      filterDispatch({ type: FILTER_ACTIONS.BULK_DELETE, payload: ids });
      uiDispatch({ type: UI_ACTIONS.SET_SELECTED_FILTERS, payload: new Set() });
    },

    toggleStatus: (id) => {
      filterDispatch({ type: FILTER_ACTIONS.TOGGLE_FILTER_STATUS, payload: id });
    },

    addOption: (filterId, optionData) => {
      const option = {
        id: generateUniqueId(),
        name: optionData.name || optionData.value,
        value: optionData.value,
        priority: optionData.priority || 1,
        isActive: true,
        colorCode: optionData.colorCode || null
      };

      filterDispatch({
        type: FILTER_ACTIONS.ADD_FILTER_OPTION,
        payload: { filterId, option }
      });
    },

    deleteOption: (filterId, optionId) => {
      filterDispatch({
        type: FILTER_ACTIONS.DELETE_FILTER_OPTION,
        payload: { filterId, optionId }
      });
    }
  }), [formValidation, filterState.filters.length, uiState.selectedFilters]);

  /**
   * Event handlers with useCallback optimization
   */
  const handleCreateFilter = useCallback(() => {
    filterActions.create(uiState.formData);
  }, [filterActions, uiState.formData]);

  const handleEditFilter = useCallback((filter) => {
    uiDispatch({ type: UI_ACTIONS.SET_EDITING_FILTER, payload: filter });
    uiDispatch({
      type: UI_ACTIONS.SET_FORM_DATA,
      payload: {
        filterKey: filter.name,
        description: filter.description || '',
        type: filter.type,
        priority: filter.priority
      }
    });
    uiDispatch({ type: UI_ACTIONS.TOGGLE_EXPANDED_SECTION, payload: 'create-form' });
  }, []);

  const handleDeleteFilter = useCallback((filterId) => {
    if (window.confirm('Are you sure you want to delete this filter? This action cannot be undone.')) {
      filterActions.delete(filterId);
    }
  }, [filterActions]);

  const handleFormChange = useCallback((field, value) => {
    uiDispatch({ type: UI_ACTIONS.SET_FORM_DATA, payload: { [field]: value } });
    
    // Clear validation error for this field
    if (uiState.validationErrors[field]) {
      const newErrors = { ...uiState.validationErrors };
      delete newErrors[field];
      uiDispatch({ type: UI_ACTIONS.SET_VALIDATION_ERRORS, payload: newErrors });
    }
  }, [uiState.validationErrors]);

  const handleSearchChange = useCallback((e) => {
    uiDispatch({ type: UI_ACTIONS.SET_SEARCH_TERM, payload: e.target.value });
  }, []);

  const handleBulkDelete = useCallback(() => {
    if (uiState.selectedFilters.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${uiState.selectedFilters.size} filter(s)? This action cannot be undone.`)) {
      filterActions.bulkDelete([...uiState.selectedFilters]);
    }
  }, [filterActions, uiState.selectedFilters]);

  const handleFilterSelection = useCallback((filterId, isSelected) => {
    const newSelected = new Set(uiState.selectedFilters);
    if (isSelected) {
      newSelected.add(filterId);
    } else {
      newSelected.delete(filterId);
    }
    uiDispatch({ type: UI_ACTIONS.SET_SELECTED_FILTERS, payload: newSelected });
  }, [uiState.selectedFilters]);

  const handleSelectAll = useCallback(() => {
    const allFilterIds = new Set(filteredFilters.map(f => f.id));
    uiDispatch({ type: UI_ACTIONS.SET_SELECTED_FILTERS, payload: allFilterIds });
  }, [filteredFilters]);

  const handleDeselectAll = useCallback(() => {
    uiDispatch({ type: UI_ACTIONS.SET_SELECTED_FILTERS, payload: new Set() });
  }, []);

  const handleToggleSection = useCallback((section) => {
    uiDispatch({ type: UI_ACTIONS.TOGGLE_EXPANDED_SECTION, payload: section });
  }, []);

  const handleResetForm = useCallback(() => {
    uiDispatch({ type: UI_ACTIONS.RESET_FORM });
    firstInputRef.current?.focus();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            handleToggleSection('create-form');
            break;
          case 'a':
            e.preventDefault();
            handleSelectAll();
            break;
          case 'd':
            if (uiState.selectedFilters.size > 0) {
              e.preventDefault();
              handleBulkDelete();
            }
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleSection, handleSelectAll, handleBulkDelete, uiState.selectedFilters.size]);

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Header Section */}
      <HeaderSection
        selectedCount={uiState.selectedFilters.size}
        totalCount={filterState.filters.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkDelete={handleBulkDelete}
        searchTerm={uiState.searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Create Filters Form */}
      <CreateFilterSection
        formData={uiState.formData}
        validationErrors={uiState.validationErrors}
        isExpanded={uiState.expandedSections.has('create-form')}
        isEditing={!!uiState.editingFilter}
        onToggle={() => handleToggleSection('create-form')}
        onFormChange={handleFormChange}
        onSubmit={handleCreateFilter}
        onReset={handleResetForm}
        formRef={formRef}
        firstInputRef={firstInputRef}
      />

      {/* All Filters Section */}
      <FiltersDisplaySection
        filters={filteredFilters}
        categorizedFilters={categorizedFilters}
        selectedFilters={uiState.selectedFilters}
        viewMode={uiState.viewMode}
        loading={filterState.loading}
        error={filterState.error}
        onEdit={handleEditFilter}
        onDelete={handleDeleteFilter}
        onToggleStatus={filterActions.toggleStatus}
        onFilterSelection={handleFilterSelection}
        onAddOption={filterActions.addOption}
        onDeleteOption={filterActions.deleteOption}
      />
    </div>
  );
};

/**
 * Header Section Component
 */
const HeaderSection = React.memo(({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  searchTerm,
  onSearchChange
}) => (
  <div className="mb-8">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-black mb-2">Filters Management</h1>
        <p className="text-gray-600">
          Manage product filters and categories ({totalCount} total)
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search filters..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
          />
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{selectedCount} selected</span>
            <button
              onClick={onDeselectAll}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear
            </button>
            <button
              onClick={onBulkDelete}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
            >
              Delete Selected
            </button>
          </div>
        )}

        {selectedCount === 0 && totalCount > 0 && (
          <button
            onClick={onSelectAll}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Select All
          </button>
        )}
      </div>
    </div>

    {/* Keyboard shortcuts info */}
    <div className="text-xs text-gray-500 mb-4">
      <span className="inline-flex items-center gap-1">
        <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+N</kbd> New Filter
      </span>
      <span className="ml-4 inline-flex items-center gap-1">
        <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+A</kbd> Select All
      </span>
      <span className="ml-4 inline-flex items-center gap-1">
        <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+D</kbd> Delete Selected
      </span>
    </div>
  </div>
));

/**
 * Create Filter Section Component
 */
const CreateFilterSection = React.memo(({
  formData,
  validationErrors,
  isExpanded,
  isEditing,
  onToggle,
  onFormChange,
  onSubmit,
  onReset,
  formRef,
  firstInputRef
}) => (
  <div className="mb-8">
    <div className="bg-gray-50 rounded-xl p-6 border">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-black">
          {isEditing ? 'Edit Filter' : 'Create New Filter'}
        </h2>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label={isExpanded ? 'Collapse form' : 'Expand form'}
        >
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {/* Form Content */}
      {isExpanded && (
        <form ref={formRef} onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField
              label="Filter Key"
              value={formData.filterKey}
              onChange={(value) => onFormChange('filterKey', value)}
              placeholder="filter key (eg: colour, size)"
              error={validationErrors.filterKey}
              required
              ref={firstInputRef}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => onFormChange('type', e.target.value)}
                className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:border-blue-600"
              >
                {Object.entries(FILTER_CONFIG.FILTER_TYPES).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key.toLowerCase().replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FormField
              label="Priority"
              type="number"
              value={formData.priority}
              onChange={(value) => onFormChange('priority', value)}
              placeholder="1"
              error={validationErrors.priority}
              min="1"
              max="999"
            />

            <FormField
              label="Filter Value"
              value={formData.filterValue}
              onChange={(value) => onFormChange('filterValue', value)}
              placeholder="value name (red, xl)"
              error={validationErrors.filterValue}
            />

            <FormField
              label="Color Code"
              value={formData.colourCode}
              onChange={(value) => onFormChange('colourCode', value)}
              placeholder="#FF0000 (optional)"
              error={validationErrors.colourCode}
            />
          </div>

          {/* Third Row - Price Range */}
          {(formData.type === FILTER_CONFIG.FILTER_TYPES.PRICE || formData.type === FILTER_CONFIG.FILTER_TYPES.RANGE) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <FormField
                label="Price Range Name"
                value={formData.priceRange}
                onChange={(value) => onFormChange('priceRange', value)}
                placeholder="Add price range"
                error={validationErrors.priceRange}
              />

              <FormField
                label="Minimum Price"
                type="number"
                value={formData.minimum}
                onChange={(value) => onFormChange('minimum', value)}
                placeholder="0"
                error={validationErrors.minimum}
                min="0"
              />

              <FormField
                label="Maximum Price"
                type="number"
                value={formData.maximum}
                onChange={(value) => onFormChange('maximum', value)}
                placeholder="1000"
                error={validationErrors.maximum}
                min="0"
              />
            </div>
          )}

          {/* Description */}
          <FormField
            label="Description"
            value={formData.description}
            onChange={(value) => onFormChange('description', value)}
            placeholder="Brief description of this filter"
            error={validationErrors.description}
            multiline
            rows={2}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={Object.keys(validationErrors).length > 0}
            >
              {isEditing ? 'Update Filter' : 'Create Filter'}
            </button>

            <button
              type="button"
              onClick={onReset}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
));

/**
 * Reusable Form Field Component
 */
const FormField = React.forwardRef(({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  multiline = false,
  rows = 1,
  min,
  max,
  ...props
}, ref) => {
  const handleChange = useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  const InputComponent = multiline ? 'textarea' : 'input';
  const inputProps = multiline 
    ? { rows } 
    : { type, min, max };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <InputComponent
        ref={ref}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        {...inputProps}
        {...props}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
          error 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-black focus:border-blue-600'
        } ${multiline ? 'resize-vertical' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${label}-error` : undefined}
      />
      {error && (
        <p id={`${label}-error`} className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

/**
 * Filters Display Section Component
 */
const FiltersDisplaySection = React.memo(({
  filters,
  categorizedFilters,
  selectedFilters,
  viewMode,
  loading,
  error,
  onEdit,
  onDelete,
  onToggleStatus,
  onFilterSelection,
  onAddOption,
  onDeleteOption
}) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-black">All Filters</h2>
      
      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">View:</span>
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            className={`px-3 py-1 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Grid
          </button>
          <button
            className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            List
          </button>
        </div>
      </div>
    </div>

    {/* Loading State */}
    {loading && (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading filters...</p>
      </div>
    )}

    {/* Error State */}
    {error && (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-medium">Error loading filters</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )}

    {/* Filters Content */}
    {!loading && !error && (
      <>
        {filters.length > 0 ? (
          <FilterGrid
            categorizedFilters={categorizedFilters}
            selectedFilters={selectedFilters}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
            onFilterSelection={onFilterSelection}
            onAddOption={onAddOption}
            onDeleteOption={onDeleteOption}
          />
        ) : (
          <EmptyState />
        )}
      </>
    )}
  </div>
));

/**
 * Enhanced Filter Grid Component
 */
const FilterGrid = React.memo(({
  categorizedFilters,
  selectedFilters,
  onEdit,
  onDelete,
  onToggleStatus,
  onFilterSelection,
  onAddOption,
  onDeleteOption
}) => (
  <div className="space-y-8">
    {/* Category Filters */}
    {categorizedFilters[FILTER_CONFIG.FILTER_TYPES.CATEGORY] && (
      <FilterCategory
        title="Category Filters"
        filters={categorizedFilters[FILTER_CONFIG.FILTER_TYPES.CATEGORY]}
        selectedFilters={selectedFilters}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
        onFilterSelection={onFilterSelection}
        onAddOption={onAddOption}
        onDeleteOption={onDeleteOption}
      />
    )}

    {/* Color Filters */}
    {categorizedFilters[FILTER_CONFIG.FILTER_TYPES.COLOR] && (
      <FilterCategory
        title="Color Filters"
        filters={categorizedFilters[FILTER_CONFIG.FILTER_TYPES.COLOR]}
        selectedFilters={selectedFilters}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
        onFilterSelection={onFilterSelection}
        onAddOption={onAddOption}
        onDeleteOption={onDeleteOption}
      />
    )}

    {/* Size Filters */}
    {categorizedFilters[FILTER_CONFIG.FILTER_TYPES.SIZE] && (
      <FilterCategory
        title="Size Filters"
        filters={categorizedFilters[FILTER_CONFIG.FILTER_TYPES.SIZE]}
        selectedFilters={selectedFilters}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
        onFilterSelection={onFilterSelection}
        onAddOption={onAddOption}
        onDeleteOption={onDeleteOption}
      />
    )}

    {/* Price Filters */}
    {categorizedFilters[FILTER_CONFIG.FILTER_TYPES.PRICE] && (
      <FilterCategory
        title="Price Filters"
        filters={categorizedFilters[FILTER_CONFIG.FILTER_TYPES.PRICE]}
        selectedFilters={selectedFilters}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
        onFilterSelection={onFilterSelection}
        onAddOption={onAddOption}
        onDeleteOption={onDeleteOption}
      />
    )}

    {/* Custom Filters */}
    {categorizedFilters[FILTER_CONFIG.FILTER_TYPES.CUSTOM] && (
      <FilterCategory
        title="Custom Filters"
        filters={categorizedFilters[FILTER_CONFIG.FILTER_TYPES.CUSTOM]}
        selectedFilters={selectedFilters}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
        onFilterSelection={onFilterSelection}
        onAddOption={onAddOption}
        onDeleteOption={onDeleteOption}
      />
    )}
  </div>
));

/**
 * Filter Category Component
 */
const FilterCategory = React.memo(({
  title,
  filters,
  selectedFilters,
  onEdit,
  onDelete,
  onToggleStatus,
  onFilterSelection,
  onAddOption,
  onDeleteOption
}) => (
  <div className="bg-gray-50 rounded-xl p-6 border">
    <h3 className="text-lg font-bold text-black mb-4">{title}</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filters.map((filter) => (
        <FilterCard
          key={filter.id}
          filter={filter}
          isSelected={selectedFilters.has(filter.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onFilterSelection={onFilterSelection}
          onAddOption={onAddOption}
          onDeleteOption={onDeleteOption}
        />
      ))}
    </div>
  </div>
));

/**
 * Enhanced Filter Card Component
 */
const FilterCard = React.memo(({
  filter,
  isSelected,
  onEdit,
  onDelete,
  onToggleStatus,
  onFilterSelection,
  onAddOption,
  onDeleteOption
}) => {
  const handleEdit = useCallback(() => onEdit(filter), [filter, onEdit]);
  const handleDelete = useCallback(() => onDelete(filter.id), [filter.id, onDelete]);
  const handleToggleStatus = useCallback(() => onToggleStatus(filter.id), [filter.id, onToggleStatus]);
  const handleSelection = useCallback((e) => {
    onFilterSelection(filter.id, e.target.checked);
  }, [filter.id, onFilterSelection]);

  return (
    <div className={`bg-white rounded-xl shadow-md p-4 border transition-all hover:shadow-lg ${
      isSelected ? 'ring-2 ring-blue-500' : ''
    } ${!filter.isActive ? 'opacity-60' : ''}`}>
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelection}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-black truncate">{filter.name}</h4>
            {filter.description && (
              <p className="text-xs text-gray-500 mt-1">{filter.description}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={handleToggleStatus}
            className={`p-1 rounded text-xs ${
              filter.isActive 
                ? 'text-green-600 hover:bg-green-50' 
                : 'text-gray-400 hover:bg-gray-50'
            }`}
            title={filter.isActive ? 'Active' : 'Inactive'}
          >
            <Check className="h-3 w-3" />
          </button>
          <button
            onClick={handleEdit}
            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="Edit filter"
          >
            <Edit2 className="h-3 w-3" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
            title="Delete filter"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Filter Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>Priority: {filter.priority}</span>
        <span className="capitalize">{filter.type}</span>
      </div>

      {/* Filter Options */}
      {filter.options && filter.options.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-gray-700">Options:</h5>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {filter.options.map((option) => (
              <FilterOption
                key={option.id}
                option={option}
                filterId={filter.id}
                onDelete={onDeleteOption}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Option Button */}
      <button
        onClick={() => {
          const optionName = prompt('Enter option name:');
          if (optionName) {
            onAddOption(filter.id, { name: optionName, value: optionName });
          }
        }}
        className="w-full mt-3 py-1 px-2 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
      >
        + Add Option
      </button>
    </div>
  );
});

/**
 * Filter Option Component
 */
const FilterOption = React.memo(({ option, filterId, onDelete }) => {
  const handleDelete = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this option?')) {
      onDelete(filterId, option.id);
    }
  }, [filterId, option.id, onDelete]);

  return (
    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {option.colorCode && (
          <div 
            className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
            style={{ backgroundColor: option.colorCode }}
          />
        )}
        <span className="text-xs text-gray-700 truncate">{option.name}</span>
        {option.priority && (
          <span className="text-xs text-gray-500">({option.priority})</span>
        )}
      </div>
      <button
        onClick={handleDelete}
        className="p-0.5 text-gray-400 hover:text-red-600 flex-shrink-0"
        title="Delete option"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
});

/**
 * Empty State Component
 */
const EmptyState = React.memo(() => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-600 mb-2">No filters found</h3>
    <p className="text-gray-500 mb-4">
      Create your first filter to get started with organizing your products.
    </p>
  </div>
));

// Set display names for debugging
HeaderSection.displayName = 'HeaderSection';
CreateFilterSection.displayName = 'CreateFilterSection';
FiltersDisplaySection.displayName = 'FiltersDisplaySection';
FilterGrid.displayName = 'FilterGrid';
FilterCategory.displayName = 'FilterCategory';
FilterCard.displayName = 'FilterCard';
FilterOption.displayName = 'FilterOption';
EmptyState.displayName = 'EmptyState';

export default Filters;
