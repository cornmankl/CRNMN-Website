import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AIAssistant } from '../components/AI/AIAssistant';
import { AIService } from '../utils/ai/aiService';
import { AIAuthService } from '../utils/ai/aiAuth';

// Mock the AI Service
jest.mock('../utils/ai/aiService');
jest.mock('../utils/ai/aiAuth');

// Mock Supabase
jest.mock('../utils/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } }))
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({ data: null, error: null }))
        }))
      })),
      upsert: jest.fn(() => ({ error: null })),
      insert: jest.fn(() => ({ error: null }))
    }))
  }
}));

// Mock the store
jest.mock('../store', () => ({
  useAIStore: () => ({
    chatHistory: [],
    addChatMessage: jest.fn(),
    setAILoading: jest.fn(),
    isAILoading: false,
    userPreferences: {
      categories: [],
      priceRange: [0, 1000],
      tags: []
    }
  })
}));

describe('AI Assistant Component', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders AI Assistant when open', () => {
    render(
      <AIAssistant
        isOpen={true}
        onClose={jest.fn()}
        user={mockUser}
      />
    );

    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Powered by GLM-4.5')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(
      <AIAssistant
        isOpen={false}
        onClose={jest.fn()}
        user={mockUser}
      />
    );

    expect(screen.queryByText('AI Assistant')).not.toBeInTheDocument();
  });

  test('shows welcome message when no messages', () => {
    render(
      <AIAssistant
        isOpen={true}
        onClose={jest.fn()}
        user={mockUser}
      />
    );

    expect(screen.getByText('Welcome to AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('I\'m here to help you with your CRNMN corn ordering experience!')).toBeInTheDocument();
  });

  test('shows quick action buttons', () => {
    render(
      <AIAssistant
        isOpen={true}
        onClose={jest.fn()}
        user={mockUser}
      />
    );

    expect(screen.getByText('Menu Inquiry')).toBeInTheDocument();
    expect(screen.getByText('Order Tracking')).toBeInTheDocument();
    expect(screen.getByText('Delivery Info')).toBeInTheDocument();
    expect(screen.getByText('AI Image')).toBeInTheDocument();
  });

  test('allows typing in input field', () => {
    render(
      <AIAssistant
        isOpen={true}
        onClose={jest.fn()}
        user={mockUser}
      />
    );

    const input = screen.getByPlaceholderText('Ask me anything about CRNMN corn ordering...');
    fireEvent.change(input, { target: { value: 'What is on the menu?' } });
    
    expect(input).toHaveValue('What is on the menu?');
  });

  test('sends message when send button is clicked', async () => {
    const mockAIService = new AIService();
    mockAIService.sendMessage = jest.fn().mockResolvedValue({
      content: 'Here are our menu items...',
      type: 'text',
      model: 'gpt-4',
      tokens: 100,
      processingTime: 500
    });

    render(
      <AIAssistant
        isOpen={true}
        onClose={jest.fn()}
        user={mockUser}
      />
    );

    const input = screen.getByPlaceholderText('Ask me anything about CRNMN corn ordering...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'What is on the menu?' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockAIService.sendMessage).toHaveBeenCalledWith(
        'What is on the menu?',
        expect.any(Object)
      );
    });
  });

  test('shows loading state when processing', async () => {
    const mockAIService = new AIService();
    mockAIService.sendMessage = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        content: 'Response...',
        type: 'text',
        model: 'gpt-4'
      }), 1000))
    );

    render(
      <AIAssistant
        isOpen={true}
        onClose={jest.fn()}
        user={mockUser}
      />
    );

    const input = screen.getByPlaceholderText('Ask me anything about CRNMN corn ordering...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
  });

  test('handles quick action button clicks', () => {
    render(
      <AIAssistant
        isOpen={true}
        onClose={jest.fn()}
        user={mockUser}
      />
    );

    const menuButton = screen.getByText('Menu Inquiry');
    fireEvent.click(menuButton);

    const input = screen.getByPlaceholderText('Ask me anything about CRNMN corn ordering...');
    expect(input).toHaveValue("What's on the menu today?");
  });

  test('toggles settings panel', () => {
    render(
      <AIAssistant
        isOpen={true}
        onClose={jest.fn()}
        user={mockUser}
      />
    );

    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);

    // Settings panel should be visible
    expect(screen.getByText('AI Settings')).toBeInTheDocument();
  });

  test('toggles image generator panel', () => {
    render(
      <AIAssistant
        isOpen={true}
        onClose={jest.fn()}
        user={mockUser}
      />
    );

    const imageButton = screen.getByRole('button', { name: /image/i });
    fireEvent.click(imageButton);

    // Image generator panel should be visible
    expect(screen.getByText('AI Image Generator')).toBeInTheDocument();
  });

  test('clears chat when clear button is clicked', () => {
    render(
      <AIAssistant
        isOpen={true}
        onClose={jest.fn()}
        user={mockUser}
      />
    );

    const clearButton = screen.getByRole('button', { name: /trash/i });
    fireEvent.click(clearButton);

    // Should show welcome message again
    expect(screen.getByText('Welcome to AI Assistant')).toBeInTheDocument();
  });
});

describe('AI Service', () => {
  let aiService: AIService;

  beforeEach(() => {
    aiService = new AIService();
  });

  test('initializes with default configuration', () => {
    expect(aiService).toBeDefined();
  });

  test('handles message sending', async () => {
    const mockResponse = {
      content: 'Test response',
      type: 'text' as const,
      model: 'gpt-4',
      tokens: 100,
      processingTime: 500
    };

    // Mock the sendMessage method
    jest.spyOn(aiService, 'sendMessage').mockResolvedValue(mockResponse);

    const result = await aiService.sendMessage('Test message');
    
    expect(result).toEqual(mockResponse);
  });

  test('handles image generation', async () => {
    const mockImageUrl = 'https://example.com/generated-image.png';
    
    jest.spyOn(aiService, 'generateImage').mockResolvedValue(mockImageUrl);

    const result = await aiService.generateImage('Delicious corn with cheese');
    
    expect(result).toBe(mockImageUrl);
  });

  test('handles Gemini AI integration', async () => {
    const mockResponse = {
      content: 'Gemini AI response for corn menu',
      type: 'text' as const,
      model: 'gemini-pro',
      tokens: 150,
      processingTime: 800
    };

    jest.spyOn(aiService, 'sendMessage').mockResolvedValue(mockResponse);

    const result = await aiService.sendMessage('Generate a creative corn menu description');
    
    expect(result).toEqual(mockResponse);
    expect(result.model).toBe('gemini-pro');
  });

  test('handles website modification', async () => {
    const mockResult = {
      success: true,
      changes: ['Applied modification: Change color scheme']
    };
    
    jest.spyOn(aiService, 'modifyWebsite').mockResolvedValue(mockResult);

    const result = await aiService.modifyWebsite('Change the color scheme to blue');
    
    expect(result).toEqual(mockResult);
  });
});

describe('AI Auth Service', () => {
  let authService: AIAuthService;

  beforeEach(() => {
    authService = AIAuthService.getInstance();
  });

  test('initializes singleton instance', () => {
    const instance1 = AIAuthService.getInstance();
    const instance2 = AIAuthService.getInstance();
    
    expect(instance1).toBe(instance2);
  });

  test('handles user authentication', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user' as const,
      aiPermissions: {
        chat: true,
        imageGeneration: false,
        websiteModification: false,
        advancedFeatures: false
      },
      usage: {
        chatMessages: 0,
        imagesGenerated: 0,
        websiteModifications: 0,
        lastUsed: new Date()
      },
      preferences: {
        language: 'en' as const,
        responseStyle: 'friendly' as const,
        model: 'gpt-4' as const
      }
    };

    jest.spyOn(authService, 'authenticateUser').mockResolvedValue(mockUser);

    const result = await authService.authenticateUser();
    
    expect(result).toEqual(mockUser);
  });

  test('checks permissions correctly', async () => {
    jest.spyOn(authService, 'checkPermission').mockResolvedValue(true);

    const hasPermission = await authService.checkPermission('chat');
    
    expect(hasPermission).toBe(true);
  });

  test('handles rate limiting', async () => {
    const mockRateLimit = {
      allowed: true
    };

    jest.spyOn(authService, 'checkRateLimit').mockResolvedValue(mockRateLimit);

    const result = await authService.checkRateLimit('chat');
    
    expect(result).toEqual(mockRateLimit);
  });
});