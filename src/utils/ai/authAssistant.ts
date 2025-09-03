/**
 * AI-Powered Authentication Assistant
 * Provides intelligent assistance during authentication process
 */

import { AIService } from './aiService';

export interface AuthContext {
  isLogin: boolean;
  currentField?: string;
  formData: Record<string, any>;
  errors: Record<string, string>;
  userAgent: string;
  timestamp: number;
}

export interface AIAuthSuggestion {
  type: 'suggestion' | 'warning' | 'improvement' | 'security' | 'help';
  message: string;
  action?: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface SmartValidation {
  field: string;
  isValid: boolean;
  suggestion?: string;
  improvement?: string;
  securityNote?: string;
}

export interface AuthAnalysis {
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  securityScore: number;
  userExperienceScore: number;
  estimatedCompletionTime: number;
}

export class AuthAssistantService {
  private aiService: AIService;
  private authContext: AuthContext;
  private suggestionHistory: AIAuthSuggestion[] = [];

  constructor() {
    this.aiService = new AIService();
    this.authContext = {
      isLogin: true,
      formData: {},
      errors: {},
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    };
  }

  /**
   * Update authentication context
   */
  updateContext(context: Partial<AuthContext>): void {
    this.authContext = { ...this.authContext, ...context };
  }

  /**
   * Get AI assistance for form field
   */
  async getFieldAssistance(field: string, value: string): Promise<AIAuthSuggestion> {
    const prompt = this.buildFieldAssistancePrompt(field, value);
    
    try {
      const response = await this.aiService.generateResponse(prompt);
      const suggestion = this.parseAIResponse(response, 'suggestion');
      
      this.suggestionHistory.push(suggestion);
      return suggestion;
    } catch (error) {
      console.error('AI field assistance error:', error);
      return this.getFallbackSuggestion(field);
    }
  }

  /**
   * Smart form validation with AI enhancement
   */
  async validateFormWithAI(formData: Record<string, any>): Promise<SmartValidation[]> {
    const validations: SmartValidation[] = [];
    
    for (const [field, value] of Object.entries(formData)) {
      if (typeof value === 'string' && value.trim()) {
        const validation = await this.validateField(field, value);
        validations.push(validation);
      }
    }

    return validations;
  }

  /**
   * Analyze authentication session for security and UX
   */
  async analyzeAuthSession(): Promise<AuthAnalysis> {
    const prompt = `
    Analyze this authentication session:
    - Mode: ${this.authContext.isLogin ? 'Login' : 'Signup'}
    - Fields completed: ${Object.keys(this.authContext.formData).length}
    - Errors encountered: ${Object.keys(this.authContext.errors).length}
    - Session duration: ${Date.now() - this.authContext.timestamp}ms
    
    Provide analysis in JSON format:
    {
      "riskLevel": "low|medium|high",
      "recommendations": ["rec1", "rec2"],
      "securityScore": 0-100,
      "userExperienceScore": 0-100,
      "estimatedCompletionTime": milliseconds
    }
    `;

    try {
      const response = await this.aiService.generateResponse(prompt);
      return this.parseAnalysisResponse(response);
    } catch (error) {
      console.error('Auth analysis error:', error);
      return this.getFallbackAnalysis();
    }
  }

  /**
   * Get contextual help based on user's current situation
   */
  async getContextualHelp(): Promise<AIAuthSuggestion> {
    const prompt = `
    User needs help with authentication. Context:
    - Current mode: ${this.authContext.isLogin ? 'Login' : 'Registration'}
    - Current field: ${this.authContext.currentField || 'none'}
    - Has errors: ${Object.keys(this.authContext.errors).length > 0}
    - Recent errors: ${JSON.stringify(this.authContext.errors)}
    
    Provide helpful, encouraging guidance (max 80 words) for CRNMN corn ordering website.
    `;

    try {
      const response = await this.aiService.generateResponse(prompt);
      return this.parseAIResponse(response, 'help');
    } catch (error) {
      return {
        type: 'help',
        message: 'I\'m here to help! If you\'re having trouble, try using a different authentication method or contact our support team.',
        confidence: 0.8,
        priority: 'medium'
      };
    }
  }

  /**
   * Generate smart email domain suggestions
   */
  async suggestEmailCompletion(partialEmail: string): Promise<string[]> {
    if (!partialEmail.includes('@') || partialEmail.length < 3) {
      return [];
    }

    const commonDomains = [
      'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
      'icloud.com', 'protonmail.com', 'aol.com'
    ];

    const [localPart, domainPart = ''] = partialEmail.split('@');
    
    if (domainPart.length === 0) {
      return commonDomains.map(domain => `${localPart}@${domain}`);
    }

    // Fuzzy match domains
    const matchedDomains = commonDomains
      .filter(domain => domain.toLowerCase().startsWith(domainPart.toLowerCase()))
      .slice(0, 3);

    return matchedDomains.map(domain => `${localPart}@${domain}`);
  }

  /**
   * Smart password suggestions based on user context
   */
  async generatePasswordSuggestion(): Promise<string> {
    const prompt = `
    Generate a secure, memorable password suggestion for a corn ordering website user.
    Requirements:
    - 12+ characters
    - Mix of letters, numbers, symbols
    - Corn/food theme friendly
    - Easy to remember but secure
    
    Return only the password suggestion.
    `;

    try {
      const response = await this.aiService.generateResponse(prompt);
      return response.trim().replace(/['"]/g, ''); // Clean quotes
    } catch (error) {
      // Fallback password suggestions
      const cornThemes = ['GoldenCorn', 'SweetKernel', 'FreshHarvest', 'CornMaze'];
      const theme = cornThemes[Math.floor(Math.random() * cornThemes.length)];
      const number = Math.floor(Math.random() * 9999) + 1000;
      const symbol = ['!', '@', '#', '$', '%'][Math.floor(Math.random() * 5)];
      
      return `${theme}${number}${symbol}`;
    }
  }

  /**
   * Detect potential security issues in form data
   */
  async detectSecurityIssues(formData: Record<string, any>): Promise<AIAuthSuggestion[]> {
    const issues: AIAuthSuggestion[] = [];
    
    // Check for common security patterns
    if (formData.password) {
      const password = formData.password.toLowerCase();
      
      // Check for common weak patterns
      if (/password|123456|qwerty|admin/.test(password)) {
        issues.push({
          type: 'security',
          message: 'This password contains common patterns that are easy to guess. Consider using a more unique password.',
          confidence: 0.9,
          priority: 'high'
        });
      }

      // Check if password contains email
      if (formData.email && password.includes(formData.email.split('@')[0].toLowerCase())) {
        issues.push({
          type: 'security',
          message: 'Your password shouldn\'t contain your email address for better security.',
          confidence: 0.95,
          priority: 'high'
        });
      }
    }

    // Check email patterns
    if (formData.email) {
      const email = formData.email.toLowerCase();
      
      // Check for temporary email services
      const tempDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'];
      if (tempDomains.some(domain => email.includes(domain))) {
        issues.push({
          type: 'warning',
          message: 'Temporary email addresses may cause issues with order notifications. Consider using a permanent email.',
          confidence: 0.8,
          priority: 'medium'
        });
      }
    }

    return issues;
  }

  /**
   * Generate onboarding tips based on user profile
   */
  async generateOnboardingTips(userType: 'new' | 'returning' | 'premium'): Promise<string[]> {
    const prompts = {
      new: 'Generate 3 helpful onboarding tips for a new user joining CRNMN corn ordering platform (max 20 words each)',
      returning: 'Generate 3 tips for a returning user to CRNMN about new features or improvements (max 20 words each)',
      premium: 'Generate 3 exclusive tips for premium CRNMN members about advanced features (max 20 words each)'
    };

    try {
      const response = await this.aiService.generateResponse(prompts[userType]);
      
      // Parse response into array
      const tips = response.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.?\s*[-•]?\s*/, '').trim())
        .filter(tip => tip.length > 10)
        .slice(0, 3);

      return tips;
    } catch (error) {
      console.error('Onboarding tips error:', error);
      return this.getFallbackTips(userType);
    }
  }

  /**
   * Smart autofill suggestions
   */
  async suggestAutofill(field: string, context: string): Promise<string[]> {
    const suggestions: string[] = [];

    switch (field) {
      case 'name':
        // In real app, could use previous entries or social login data
        suggestions.push('John Doe', 'Jane Smith', 'Alex Johnson');
        break;
        
      case 'phone':
        // Format suggestions based on detected location
        const formats = ['+1 (555) 000-0000', '+44 20 7000 0000', '+86 138 0000 0000'];
        suggestions.push(...formats);
        break;
        
      default:
        break;
    }

    return suggestions;
  }

  /**
   * Build AI prompt for field assistance
   */
  private buildFieldAssistancePrompt(field: string, value: string): string {
    return `
    As an AI assistant for CRNMN corn ordering platform, help the user with their ${field} field.
    Current value: "${value}"
    Context: ${this.authContext.isLogin ? 'Login' : 'Account creation'}
    
    Provide helpful, brief suggestion (max 50 words) to improve their input.
    Be encouraging and corn/food themed when appropriate.
    Focus on: clarity, security, user experience.
    `;
  }

  /**
   * Parse AI response into structured suggestion
   */
  private parseAIResponse(response: string, type: AIAuthSuggestion['type']): AIAuthSuggestion {
    // Clean and parse response
    const message = response.trim().substring(0, 200); // Limit length
    
    // Estimate confidence based on response quality
    const confidence = this.estimateResponseConfidence(response);
    
    // Determine priority
    const priority = this.determinePriority(message, type);

    return {
      type,
      message,
      confidence,
      priority
    };
  }

  /**
   * Estimate AI response confidence
   */
  private estimateResponseConfidence(response: string): number {
    let confidence = 0.5;
    
    // Longer, more detailed responses tend to be more confident
    if (response.length > 50) confidence += 0.2;
    if (response.length > 100) confidence += 0.1;
    
    // Responses with specific suggestions
    if (response.includes('try') || response.includes('consider') || response.includes('suggest')) {
      confidence += 0.2;
    }
    
    return Math.min(confidence, 1);
  }

  /**
   * Determine message priority
   */
  private determinePriority(message: string, type: AIAuthSuggestion['type']): AIAuthSuggestion['priority'] {
    if (type === 'security') return 'urgent';
    
    if (message.toLowerCase().includes('error') || 
        message.toLowerCase().includes('problem') ||
        message.toLowerCase().includes('invalid')) {
      return 'high';
    }
    
    if (message.toLowerCase().includes('improve') ||
        message.toLowerCase().includes('better') ||
        message.toLowerCase().includes('recommend')) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Validate individual field with AI
   */
  private async validateField(field: string, value: string): Promise<SmartValidation> {
    const prompt = `
    Validate this ${field} field for CRNMN authentication:
    Value: "${value}"
    
    Return JSON:
    {
      "isValid": boolean,
      "suggestion": "brief improvement suggestion or null",
      "securityNote": "security concern or null"
    }
    `;

    try {
      const response = await this.aiService.generateResponse(prompt);
      const parsed = this.tryParseJSON(response);
      
      if (parsed) {
        return {
          field,
          isValid: parsed.isValid || false,
          suggestion: parsed.suggestion || undefined,
          securityNote: parsed.securityNote || undefined
        };
      }
    } catch (error) {
      console.error('Field validation error:', error);
    }

    // Fallback validation
    return {
      field,
      isValid: value.length > 0,
      suggestion: this.getBasicFieldSuggestion(field, value)
    };
  }

  /**
   * Parse analysis response from AI
   */
  private parseAnalysisResponse(response: string): AuthAnalysis {
    const parsed = this.tryParseJSON(response);
    
    if (parsed) {
      return {
        riskLevel: parsed.riskLevel || 'low',
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        securityScore: Math.max(0, Math.min(100, parsed.securityScore || 75)),
        userExperienceScore: Math.max(0, Math.min(100, parsed.userExperienceScore || 80)),
        estimatedCompletionTime: Math.max(0, parsed.estimatedCompletionTime || 30000)
      };
    }

    return this.getFallbackAnalysis();
  }

  /**
   * Try to parse JSON response safely
   */
  private tryParseJSON(response: string): any {
    try {
      // Extract JSON from response if it's embedded in text
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch {
      return null;
    }
  }

  /**
   * Get fallback suggestion when AI fails
   */
  private getFallbackSuggestion(field: string): AIAuthSuggestion {
    const fallbacks: Record<string, string> = {
      email: 'Make sure to use a valid email address for order updates and account recovery.',
      password: 'Create a strong password with at least 8 characters including letters, numbers, and symbols.',
      name: 'Enter your full name as you\'d like it to appear on your orders.',
      phone: 'Add your phone number for delivery notifications and order updates.'
    };

    return {
      type: 'suggestion',
      message: fallbacks[field] || 'Please fill in this field to continue.',
      confidence: 0.7,
      priority: 'low'
    };
  }

  /**
   * Get fallback analysis when AI fails
   */
  private getFallbackAnalysis(): AuthAnalysis {
    const completedFields = Object.keys(this.authContext.formData).length;
    const hasErrors = Object.keys(this.authContext.errors).length > 0;
    
    return {
      riskLevel: hasErrors ? 'medium' : 'low',
      recommendations: [
        'Complete all required fields',
        'Use a strong, unique password',
        'Verify your email address'
      ],
      securityScore: hasErrors ? 60 : 85,
      userExperienceScore: completedFields > 2 ? 90 : 70,
      estimatedCompletionTime: (4 - completedFields) * 15000 // 15s per field
    };
  }

  /**
   * Get fallback tips for onboarding
   */
  private getFallbackTips(userType: 'new' | 'returning' | 'premium'): string[] {
    const tips = {
      new: [
        'Welcome to CRNMN! Complete your profile to get personalized corn recommendations.',
        'Enable notifications to track your orders and get exclusive deals.',
        'Check out our loyalty program to earn points with every purchase.'
      ],
      returning: [
        'Welcome back! Check out our new AI assistant for personalized recommendations.',
        'Your loyalty points are waiting - use them for exclusive discounts.',
        'New: Track your orders in real-time with our enhanced delivery system.'
      ],
      premium: [
        'Access exclusive premium corn varieties not available to regular members.',
        'Enjoy free express delivery and priority customer support.',
        'Get early access to seasonal specials and limited-edition products.'
      ]
    };

    return tips[userType];
  }

  /**
   * Get basic field suggestion without AI
   */
  private getBasicFieldSuggestion(field: string, value: string): string {
    switch (field) {
      case 'email':
        return !value.includes('@') 
          ? 'Email should include @ symbol' 
          : 'Great! Make sure this email is correct for order notifications';
          
      case 'password':
        return value.length < 8 
          ? 'Password should be at least 8 characters long'
          : 'Strong password! Your account will be secure';
          
      case 'name':
        return value.length < 2 
          ? 'Please enter your full name'
          : 'Perfect! This name will appear on your orders';
          
      case 'phone':
        return !/\d{10,}/.test(value.replace(/\D/g, ''))
          ? 'Please enter a valid phone number'
          : 'Great! We can send you order updates via SMS';
          
      default:
        return 'Field looks good!';
    }
  }

  /**
   * Generate smart welcome message
   */
  async generateWelcomeMessage(isLogin: boolean, timeOfDay?: string): Promise<string> {
    const time = timeOfDay || this.getTimeOfDay();
    const mode = isLogin ? 'welcome back' : 'welcome to CRNMN';
    
    const prompt = `
    Generate a warm, friendly ${time} greeting for a user ${mode === 'welcome back' ? 'returning to' : 'joining'} 
    CRNMN corn ordering platform. Make it corn/food themed, encouraging, and under 30 words.
    Time context: ${time}
    `;

    try {
      const response = await this.aiService.generateResponse(prompt);
      return response.trim();
    } catch (error) {
      const fallbacks = {
        'good morning': isLogin ? 'Good morning! Ready for some fresh corn?' : 'Good morning! Join us for the freshest corn in town!',
        'good afternoon': isLogin ? 'Good afternoon! Your favorite corn awaits!' : 'Good afternoon! Discover our premium corn selection!',
        'good evening': isLogin ? 'Good evening! Perfect time for comfort corn!' : 'Good evening! Join the CRNMN corn family!',
        'good night': isLogin ? 'Late night corn craving?' : 'Welcome to CRNMN - where corn dreams come true!'
      };
      
      return fallbacks[time as keyof typeof fallbacks] || (isLogin ? 'Welcome back!' : 'Welcome to CRNMN!');
    }
  }

  /**
   * Get current time of day
   */
  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    
    if (hour < 6) return 'good night';
    if (hour < 12) return 'good morning';
    if (hour < 17) return 'good afternoon';
    if (hour < 22) return 'good evening';
    return 'good night';
  }

  /**
   * Get suggestion history
   */
  getSuggestionHistory(): AIAuthSuggestion[] {
    return [...this.suggestionHistory];
  }

  /**
   * Clear suggestion history
   */
  clearHistory(): void {
    this.suggestionHistory = [];
  }

  /**
   * Get authentication insights for analytics
   */
  getAuthInsights(): {
    totalSuggestions: number;
    securityWarnings: number;
    avgConfidence: number;
    mostCommonIssues: string[];
  } {
    const total = this.suggestionHistory.length;
    const securityWarnings = this.suggestionHistory.filter(s => s.type === 'security').length;
    const avgConfidence = total > 0 
      ? this.suggestionHistory.reduce((sum, s) => sum + s.confidence, 0) / total 
      : 0;

    // Count most common message patterns
    const messageWords = this.suggestionHistory
      .map(s => s.message.toLowerCase().split(' '))
      .flat();
    
    const wordFreq: Record<string, number> = {};
    messageWords.forEach(word => {
      if (word.length > 3) { // Only count meaningful words
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const mostCommonIssues = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([word]) => word);

    return {
      totalSuggestions: total,
      securityWarnings,
      avgConfidence: Math.round(avgConfidence * 100) / 100,
      mostCommonIssues
    };
  }
}