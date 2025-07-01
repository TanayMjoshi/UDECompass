// Natural Language Processing utilities for chat assistant
export interface Intent {
  name: string;
  confidence: number;
  entities: Entity[];
}

export interface Entity {
  type: string;
  value: string;
  start: number;
  end: number;
}

export class ChatNLP {
  private static buildingKeywords = {
    library: ['library', 'bibliothek', 'books', 'bücher', 'study', 'lernen', 'research', 'forschung'],
    cafeteria: ['cafeteria', 'mensa', 'food', 'essen', 'dining', 'restaurant', 'meal', 'mahlzeit'],
    'student-center': ['student center', 'studierendenzentrum', 'activities', 'aktivitäten', 'organizations', 'organisationen'],
    'visa-services': ['visa', 'immigration', 'einwanderung', 'permit', 'genehmigung', 'documents', 'dokumente'],
    administration: ['administration', 'verwaltung', 'registration', 'anmeldung', 'office', 'büro'],
    'ude-portals': ['portal', 'online', 'digital', 'moodle', 'website', 'platform', 'plattform']
  };

  private static intentPatterns = {
    find_building: [
      /where is|wo ist|find|finden|locate|lokalisieren/i,
      /how to get to|wie komme ich zu|direction|richtung/i
    ],
    get_hours: [
      /hours|öffnungszeiten|time|zeit|open|geöffnet|close|geschlossen/i,
      /when|wann|schedule|zeitplan/i
    ],
    get_contact: [
      /contact|kontakt|phone|telefon|email|mail|address|adresse/i,
      /call|anrufen|reach|erreichen/i
    ],
    get_services: [
      /services|dienstleistungen|what can|was kann|help|hilfe|support|unterstützung/i,
      /available|verfügbar|offer|anbieten/i
    ],
    get_info: [
      /info|information|about|über|tell me|erzähl mir|explain|erklären/i,
      /what is|was ist|describe|beschreiben/i
    ]
  };

  static extractIntent(message: string): Intent {
    const lowerMessage = message.toLowerCase();
    let bestIntent = { name: 'general', confidence: 0.3, entities: [] as Entity[] };

    // Check for intent patterns
    for (const [intentName, patterns] of Object.entries(this.intentPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(lowerMessage)) {
          const confidence = this.calculateConfidence(lowerMessage, pattern);
          if (confidence > bestIntent.confidence) {
            bestIntent = {
              name: intentName,
              confidence,
              entities: this.extractEntities(message)
            };
          }
        }
      }
    }

    return bestIntent;
  }

  static extractEntities(message: string): Entity[] {
    const entities: Entity[] = [];
    const lowerMessage = message.toLowerCase();

    // Extract building entities
    for (const [buildingId, keywords] of Object.entries(this.buildingKeywords)) {
      for (const keyword of keywords) {
        const index = lowerMessage.indexOf(keyword.toLowerCase());
        if (index !== -1) {
          entities.push({
            type: 'building',
            value: buildingId,
            start: index,
            end: index + keyword.length
          });
        }
      }
    }

    // Extract time entities
    const timePattern = /\b(\d{1,2}):?(\d{2})?\s*(am|pm|uhr)?\b/gi;
    let timeMatch;
    while ((timeMatch = timePattern.exec(message)) !== null) {
      entities.push({
        type: 'time',
        value: timeMatch[0],
        start: timeMatch.index,
        end: timeMatch.index + timeMatch[0].length
      });
    }

    // Extract day entities
    const dayPattern = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)\b/gi;
    let dayMatch;
    while ((dayMatch = dayPattern.exec(message)) !== null) {
      entities.push({
        type: 'day',
        value: dayMatch[0],
        start: dayMatch.index,
        end: dayMatch.index + dayMatch[0].length
      });
    }

    return entities;
  }

  private static calculateConfidence(message: string, pattern: RegExp): number {
    const match = message.match(pattern);
    if (!match) return 0;

    // Base confidence from pattern match
    let confidence = 0.6;

    // Boost confidence based on message length and match quality
    const matchLength = match[0].length;
    const messageLength = message.length;
    const coverage = matchLength / messageLength;
    
    confidence += coverage * 0.3;

    // Boost for exact matches
    if (match[0] === message.trim()) {
      confidence += 0.2;
    }

    return Math.min(confidence, 1.0);
  }

  static generateContextualResponse(intent: Intent, entities: Entity[], language: 'en' | 'de'): {
    response: string;
    suggestions: string[];
    quickActions: Array<{ id: string; label: string; buildingId?: string }>;
  } {
    const buildingEntity = entities.find(e => e.type === 'building');
    const timeEntity = entities.find(e => e.type === 'time');
    const dayEntity = entities.find(e => e.type === 'day');

    switch (intent.name) {
      case 'find_building':
        if (buildingEntity) {
          return this.getBuildingDirections(buildingEntity.value, language);
        }
        return this.getGeneralDirections(language);

      case 'get_hours':
        if (buildingEntity) {
          return this.getBuildingHours(buildingEntity.value, language);
        }
        return this.getGeneralHours(language);

      case 'get_contact':
        if (buildingEntity) {
          return this.getBuildingContact(buildingEntity.value, language);
        }
        return this.getGeneralContact(language);

      case 'get_services':
        if (buildingEntity) {
          return this.getBuildingServices(buildingEntity.value, language);
        }
        return this.getGeneralServices(language);

      case 'get_info':
        if (buildingEntity) {
          return this.getBuildingInfo(buildingEntity.value, language);
        }
        return this.getGeneralInfo(language);

      default:
        return this.getDefaultResponse(language);
    }
  }

  private static getBuildingDirections(buildingId: string, language: 'en' | 'de') {
    const responses = {
      en: {
        library: "The Central Library is located in the main campus area. I can show you the exact location!",
        cafeteria: "The Cafeteria/Mensa is in the central dining area. Let me guide you there!",
        'student-center': "The Student Center is the heart of campus life. I'll show you the way!",
        'visa-services': "Visa Services are in the international student support building. Here's the location!",
        administration: "The Administration Building handles all central services. I can direct you there!",
        'ude-portals': "UDE Portals are accessible online, but I can show you computer labs and help centers!"
      },
      de: {
        library: "Die Zentralbibliothek befindet sich im Hauptcampusbereich. Ich kann Ihnen den genauen Standort zeigen!",
        cafeteria: "Die Cafeteria/Mensa befindet sich im zentralen Essensbereich. Lassen Sie mich Sie dorthin führen!",
        'student-center': "Das Studierendenzentrum ist das Herz des Campus-Lebens. Ich zeige Ihnen den Weg!",
        'visa-services': "Die Visa-Services befinden sich im Gebäude für internationale Studierendenbetreuung. Hier ist der Standort!",
        administration: "Das Verwaltungsgebäude übernimmt alle zentralen Dienstleistungen. Ich kann Sie dorthin leiten!",
        'ude-portals': "UDE-Portale sind online zugänglich, aber ich kann Ihnen Computerlabore und Hilfezentren zeigen!"
      }
    };

    return {
      response: responses[language][buildingId as keyof typeof responses.en] || responses[language].library,
      suggestions: language === 'en' 
        ? ['Show on map', 'Get directions', 'Building hours', 'Contact info']
        : ['Auf Karte zeigen', 'Wegbeschreibung', 'Öffnungszeiten', 'Kontakt-Info'],
      quickActions: [{
        id: 'visit',
        label: language === 'en' ? 'Visit Building' : 'Gebäude besuchen',
        buildingId
      }]
    };
  }

  private static getBuildingHours(buildingId: string, language: 'en' | 'de') {
    const hours = {
      en: {
        library: "Library Hours:\n📚 Monday-Friday: 8AM-10PM\n📚 Saturday: 9AM-8PM\n📚 Sunday: 10AM-6PM",
        cafeteria: "Cafeteria Hours:\n🍽️ Monday-Friday: 11AM-3PM\n🍽️ Saturday: 12PM-2PM\n🍽️ Sunday: Closed",
        'student-center': "Student Center Hours:\n👥 Monday-Friday: 8AM-8PM\n👥 Saturday: 10AM-4PM\n👥 Sunday: Closed",
        'visa-services': "Visa Services Hours:\n📋 Monday-Friday: 9AM-4PM\n📋 Weekends: Closed",
        administration: "Administration Hours:\n🏢 Monday-Thursday: 8AM-4PM\n🏢 Friday: 8AM-2PM\n🏢 Weekends: Closed",
        'ude-portals': "Digital Services:\n💻 Available 24/7 online\n💻 IT Support: Monday-Friday 8AM-6PM"
      },
      de: {
        library: "Bibliothekszeiten:\n📚 Montag-Freitag: 8-22 Uhr\n📚 Samstag: 9-20 Uhr\n📚 Sonntag: 10-18 Uhr",
        cafeteria: "Cafeteria-Zeiten:\n🍽️ Montag-Freitag: 11-15 Uhr\n🍽️ Samstag: 12-14 Uhr\n🍽️ Sonntag: Geschlossen",
        'student-center': "Studierendenzentrum-Zeiten:\n👥 Montag-Freitag: 8-20 Uhr\n👥 Samstag: 10-16 Uhr\n👥 Sonntag: Geschlossen",
        'visa-services': "Visa-Services-Zeiten:\n📋 Montag-Freitag: 9-16 Uhr\n📋 Wochenenden: Geschlossen",
        administration: "Verwaltungszeiten:\n🏢 Montag-Donnerstag: 8-16 Uhr\n🏢 Freitag: 8-14 Uhr\n🏢 Wochenenden: Geschlossen",
        'ude-portals': "Digitale Services:\n💻 24/7 online verfügbar\n💻 IT-Support: Montag-Freitag 8-18 Uhr"
      }
    };

    return {
      response: hours[language][buildingId as keyof typeof hours.en] || hours[language].library,
      suggestions: language === 'en' 
        ? ['Visit building', 'Contact info', 'Services available']
        : ['Gebäude besuchen', 'Kontakt-Info', 'Verfügbare Services'],
      quickActions: [{
        id: 'visit',
        label: language === 'en' ? 'Visit Building' : 'Gebäude besuchen',
        buildingId
      }]
    };
  }

  private static getBuildingContact(buildingId: string, language: 'en' | 'de') {
    return {
      response: language === 'en' 
        ? `Contact information for this building is available. I can show you the specific contact details and help you get in touch with the right department.`
        : `Kontaktinformationen für dieses Gebäude sind verfügbar. Ich kann Ihnen die spezifischen Kontaktdaten zeigen und Ihnen helfen, mit der richtigen Abteilung in Kontakt zu treten.`,
      suggestions: language === 'en' 
        ? ['Visit building', 'General contact', 'Emergency contact']
        : ['Gebäude besuchen', 'Allgemeiner Kontakt', 'Notfallkontakt'],
      quickActions: [{
        id: 'visit',
        label: language === 'en' ? 'Visit Building' : 'Gebäude besuchen',
        buildingId
      }]
    };
  }

  private static getBuildingServices(buildingId: string, language: 'en' | 'de') {
    return {
      response: language === 'en' 
        ? `This building offers various services to support your academic journey. I can show you detailed information about all available services and how to access them.`
        : `Dieses Gebäude bietet verschiedene Services zur Unterstützung Ihrer akademischen Laufbahn. Ich kann Ihnen detaillierte Informationen über alle verfügbaren Services und deren Zugang zeigen.`,
      suggestions: language === 'en' 
        ? ['Visit building', 'Service hours', 'How to access']
        : ['Gebäude besuchen', 'Service-Zeiten', 'Zugang'],
      quickActions: [{
        id: 'visit',
        label: language === 'en' ? 'Visit Building' : 'Gebäude besuchen',
        buildingId
      }]
    };
  }

  private static getBuildingInfo(buildingId: string, language: 'en' | 'de') {
    return {
      response: language === 'en' 
        ? `I can provide comprehensive information about this building, including its services, hours, location, and how it can support your university experience.`
        : `Ich kann umfassende Informationen über dieses Gebäude bereitstellen, einschließlich seiner Services, Öffnungszeiten, Lage und wie es Ihre Universitätserfahrung unterstützen kann.`,
      suggestions: language === 'en' 
        ? ['Visit building', 'Building hours', 'Available services', 'Contact info']
        : ['Gebäude besuchen', 'Öffnungszeiten', 'Verfügbare Services', 'Kontakt-Info'],
      quickActions: [{
        id: 'visit',
        label: language === 'en' ? 'Visit Building' : 'Gebäude besuchen',
        buildingId
      }]
    };
  }

  private static getGeneralDirections(language: 'en' | 'de') {
    return {
      response: language === 'en' 
        ? "I can help you find any building on campus! Which specific building or service are you looking for?"
        : "Ich kann Ihnen helfen, jedes Gebäude auf dem Campus zu finden! Welches spezifische Gebäude oder welchen Service suchen Sie?",
      suggestions: language === 'en' 
        ? ['Library', 'Cafeteria', 'Student Center', 'Administration']
        : ['Bibliothek', 'Cafeteria', 'Studierendenzentrum', 'Verwaltung'],
      quickActions: []
    };
  }

  private static getGeneralHours(language: 'en' | 'de') {
    return {
      response: language === 'en' 
        ? "I can provide operating hours for all campus buildings and services. Which specific building's hours would you like to know?"
        : "Ich kann Öffnungszeiten für alle Campus-Gebäude und Services bereitstellen. Welche spezifischen Gebäude-Zeiten möchten Sie wissen?",
      suggestions: language === 'en' 
        ? ['Library hours', 'Cafeteria hours', 'Administration hours', 'All hours']
        : ['Bibliothekszeiten', 'Cafeteria-Zeiten', 'Verwaltungszeiten', 'Alle Zeiten'],
      quickActions: []
    };
  }

  private static getGeneralContact(language: 'en' | 'de') {
    return {
      response: language === 'en' 
        ? "Contact Information:\n\n📞 Main Campus: +49 203 379-0\n📧 General Info: info@uni-due.de\n🌐 Website: www.uni-due.de\n📍 Campus Essen: Universitätsstraße 2, 45141 Essen\n📍 Campus Duisburg: Forsthausweg 2, 47057 Duisburg"
        : "Kontaktinformationen:\n\n📞 Hauptcampus: +49 203 379-0\n📧 Allgemeine Info: info@uni-due.de\n🌐 Website: www.uni-due.de\n📍 Campus Essen: Universitätsstraße 2, 45141 Essen\n📍 Campus Duisburg: Forsthausweg 2, 47057 Duisburg",
      suggestions: language === 'en' 
        ? ['Emergency contact', 'Department contacts', 'IT support']
        : ['Notfallkontakt', 'Abteilungskontakte', 'IT-Support'],
      quickActions: []
    };
  }

  private static getGeneralServices(language: 'en' | 'de') {
    return {
      response: language === 'en' 
        ? "I can help you with information about all campus services including academic support, dining, student life, administrative services, and digital platforms. What specific service are you interested in?"
        : "Ich kann Ihnen mit Informationen über alle Campus-Services helfen, einschließlich akademischer Unterstützung, Gastronomie, Studentenleben, Verwaltungsservices und digitaler Plattformen. Welcher spezifische Service interessiert Sie?",
      suggestions: language === 'en' 
        ? ['Academic services', 'Student support', 'Dining options', 'Digital services']
        : ['Akademische Services', 'Studierendenunterstützung', 'Speisemöglichkeiten', 'Digitale Services'],
      quickActions: []
    };
  }

  private static getGeneralInfo(language: 'en' | 'de') {
    return {
      response: language === 'en' 
        ? "I'm your UDE Campus Assistant! I can provide information about buildings, services, hours, contact details, and help you navigate campus life. What would you like to know about?"
        : "Ich bin Ihr UDE Campus-Assistent! Ich kann Informationen über Gebäude, Services, Öffnungszeiten, Kontaktdaten bereitstellen und Ihnen helfen, sich im Campus-Leben zurechtzufinden. Was möchten Sie wissen?",
      suggestions: language === 'en' 
        ? ['Campus buildings', 'Student services', 'Operating hours', 'Contact information']
        : ['Campus-Gebäude', 'Studierendenservices', 'Öffnungszeiten', 'Kontaktinformationen'],
      quickActions: []
    };
  }

  private static getDefaultResponse(language: 'en' | 'de') {
    return {
      response: language === 'en' 
        ? "I'm here to help you navigate UDE campus! I can provide information about buildings, services, hours, and more. What would you like to know?"
        : "Ich bin hier, um Ihnen bei der Navigation auf dem UDE-Campus zu helfen! Ich kann Informationen über Gebäude, Services, Öffnungszeiten und mehr bereitstellen. Was möchten Sie wissen?",
      suggestions: language === 'en' 
        ? ['Find buildings', 'Campus hours', 'Contact info', 'Student services']
        : ['Gebäude finden', 'Campus-Zeiten', 'Kontakt-Info', 'Studierendenservices'],
      quickActions: []
    };
  }
}