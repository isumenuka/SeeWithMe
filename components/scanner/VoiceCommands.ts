import * as Speech from 'expo-speech';

export interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

export class VoiceCommandService {
  private static instance: VoiceCommandService;
  private isListening = false;
  private commands: VoiceCommand[] = [];

  static getInstance(): VoiceCommandService {
    if (!VoiceCommandService.instance) {
      VoiceCommandService.instance = new VoiceCommandService();
    }
    return VoiceCommandService.instance;
  }

  registerCommands(commands: VoiceCommand[]) {
    this.commands = commands;
  }

  startListening() {
    this.isListening = true;
    Speech.speak('Voice commands activated. Say scan to start, stop to end, or repeat to hear results again.', {
      rate: 0.6,
    });
  }

  stopListening() {
    this.isListening = false;
    Speech.speak('Voice commands deactivated', { rate: 0.6 });
  }

  // Mock voice recognition - in production would use speech recognition
  simulateVoiceCommand(command: string) {
    if (!this.isListening) return;

    const matchedCommand = this.commands.find(cmd => 
      cmd.command.toLowerCase().includes(command.toLowerCase())
    );

    if (matchedCommand) {
      Speech.speak(`Command recognized: ${command}`, { rate: 0.8 });
      matchedCommand.action();
    } else {
      Speech.speak('Command not recognized. Available commands are: scan, stop, repeat.', { rate: 0.6 });
    }
  }

  getAvailableCommands(): string[] {
    return this.commands.map(cmd => cmd.command);
  }
}