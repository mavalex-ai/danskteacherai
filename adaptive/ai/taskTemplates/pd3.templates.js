// Backend2/adaptive/ai/taskTemplates/pd3.templates.js

export const PD3_TASK_TEMPLATES = [
  {
    exam: 'PD3',
    level: 'B1',
    taskType: 'argumentative_text',
    context: 'work',
    register: 'semi-formal',
    prompt:
      'Mange virksomheder overvejer hjemmearbejde. ' +
      'Skriv en tekst, hvor du forklarer én fordel og én ulempe ved hjemmearbejde.',
    constraints: {
      minWords: 100,
      structureHint: [
        'Indledning',
        'Fordel',
        'Ulempe',
        'Afrunding'
      ]
    }
  },
  {
    exam: 'PD3',
    level: 'B1',
    taskType: 'structured_response',
    context: 'society',
    register: 'semi-formal',
    prompt:
      'Din kommune vil forbedre integrationsindsatsen. ' +
      'Besvar følgende spørgsmål i én samlet tekst:\n' +
      '1) Hvilket tilbud er vigtigst?\n' +
      '2) Hvorfor?\n' +
      '3) Hvem vil have mest gavn af det?',
    constraints: {
      minWords: 120,
      mustInclude: ['for eksempel', 'derfor']
    }
  },
  {
    exam: 'PD3',
    level: 'B2',
    taskType: 'reformulation',
    context: 'work',
    register: 'formal',
    prompt:
      'Omskriv følgende besked, så den passer til en formel e-mail til din leder:\n\n' +
      '"Hej, jeg kan ikke komme i morgen, fordi jeg er syg. Vi kan snakke senere."',
    constraints: {
      minWords: 60,
      mustInclude: ['venlig hilsen']
    }
  }
]
