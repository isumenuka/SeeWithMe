// Mock AI Vision Service - In production, this would integrate with Gemma 3n
export interface VisionResult {
  type: 'objects' | 'text' | 'faces' | 'navigation';
  description: string;
  confidence: number;
  timestamp: Date;
  language?: string;
}

export class AIVisionService {
  private static instance: AIVisionService;
  
  static getInstance(): AIVisionService {
    if (!AIVisionService.instance) {
      AIVisionService.instance = new AIVisionService();
    }
    return AIVisionService.instance;
  }

  async analyzeImage(imageUri: string, mode: 'objects' | 'text' | 'faces' | 'navigation'): Promise<VisionResult> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));
    
    const mockResponses = {
      objects: [
        'I can see a modern wooden dining table with a white ceramic coffee cup and a silver laptop computer. There appears to be natural lighting coming from a window on the left side.',
        'In front of you is a comfortable blue fabric armchair with a person sitting and reading a hardcover book. The room has warm lighting and appears to be a cozy living space.',
        'I detect a red sedan car parked on a paved street in front of a two-story white residential building with black shutters and a well-maintained front garden.',
        'This appears to be a contemporary kitchen with white upper and lower cabinets, stainless steel appliances including a large refrigerator, and granite countertops.',
        'There is a large oak tree with full green foliage in what appears to be a park setting. I can see a wooden bench underneath and a walking path nearby.',
      ],
      text: [
        'Menu items visible: Espresso Coffee three dollars fifty cents, Herbal Tea two dollars, Grilled Chicken Sandwich eight dollars ninety-five cents, Fresh Garden Salad six dollars fifty cents.',
        'Emergency Exit sign with an arrow pointing to the right. Below it reads: In case of emergency, do not use elevators, use stairs only.',
        'Store hours posted: Monday through Friday 9 AM to 9 PM, Saturday 10 AM to 8 PM, Sunday 11 AM to 6 PM. We welcome you to our store.',
        'Safety notice: Caution wet floor area. Please walk carefully and watch your step. Cleaning in progress.',
        'Bus schedule: Route 42 Downtown Express. Next departures: 2:15 PM, 2:45 PM, 3:15 PM. Please have exact change ready.',
      ],
      faces: [
        'I can see one person who appears to be in their thirties, with a genuine smile and friendly expression. They seem to be looking in your direction with positive body language.',
        'There is a person with glasses looking down at what appears to be a mobile device. Their expression appears focused and concentrated.',
        'I detect two people engaged in conversation. Both appear to be middle-aged adults with animated expressions, suggesting an active discussion.',
        'A person with shoulder-length hair is visible, showing a neutral to slightly positive expression while appearing to listen attentively.',
        'There are three people in the scene. One person in the center appears to be speaking while the other two are listening with interested expressions.',
      ],
      navigation: [
        'Spatial layout: There is an open doorway approximately three feet ahead and to your left. The path appears clear with no obstacles detected in your immediate walking area.',
        'I can see a staircase with handrails going upward about ten feet directly in front of you. The stairs appear to be well-lit and in good condition.',
        'Exit route identified: The main exit is located behind you and to the right, approximately fifteen feet away. The path appears clear of obstacles.',
        'Room layout: You are in an open space with room to move freely to your right. There is a wall structure on your left side extending forward.',
        'Navigation update: Clear pathway ahead for approximately twenty feet. I detect a slight incline upward and what appears to be a doorway at the end of the corridor.',
      ],
    };

    const responses = mockResponses[mode];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const confidence = 85 + Math.random() * 15; // 85-100% confidence

    return {
      type: mode,
      description: randomResponse,
      confidence: Math.round(confidence),
      timestamp: new Date(),
      language: 'en',
    };
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    // Mock translation - in production would use offline translation model
    const translations: Record<string, Record<string, string>> = {
      'Hello': {
        'es': 'Hola',
        'fr': 'Bonjour',
        'de': 'Hallo',
        'it': 'Ciao',
      },
      'Exit': {
        'es': 'Salida',
        'fr': 'Sortie',
        'de': 'Ausgang',
        'it': 'Uscita',
      },
    };

    return translations[text]?.[targetLanguage] || text;
  }
}