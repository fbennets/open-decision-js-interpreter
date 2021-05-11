let corona = {
  "header": {
    "version": 0.1,
    "build_date": "2021-05-05",
    "tree_name": "Corona Event Check",
    "tree_slug": "corona-event-check",
    "start_node": "federal-state",
    "vars": {}
  },
  "federal-state": {
    "name": "Federal State",
    "text": "<p>Please choose your Federal State.</p>",
    "inputs": [
      {
        "type": "list",
        "label": "",
        "options": [
          "Baden-W\u00fcrttemberg",
          "Bavaria",
          "Berlin",
          "Brandenburg",
          "Bremen",
          "Hamburg",
          "Hesse",
          "Lower Saxony",
          "Mecklenburg-Vorpommern",
          "North Rhine-Westphalia",
          "Rhineland-Palatinate",
          "Saarland",
          "Saxony",
          "Saxony-Anhalt",
          "Schleswig-Holstein",
          "Thuringia"
        ]
      }
    ],
    "rules": {
      "if": [
        {
          "in": [
            {
              "var": "a"
            },
            [
              "Baden-W\u00fcrttemberg",
              "Bavaria",
              "Brandenburg",
              "Bremen",
              "Hamburg",
              "Hesse",
              "Lower Saxony",
              "Mecklenburg-Vorpommern",
              "North Rhine-Westphalia",
              "Rhineland-Palatinate",
              "Saarland",
              "Saxony",
              "Saxony-Anhalt",
              "Schleswig-Holstein",
              "Thuringia"
            ]
          ]
        },
        "0",
        {
          "in": [
            {
              "var": "a"
            },
            [
              "Berlin"
            ]
          ]
        },
        "1"
      ]
    },
    "destination": {
      "0": "not-berlin",
      "1": "event-audience"
    },
    "action": {}
  },
  "not-berlin": {
    "name": "Not Berlin",
    "text": "<p>Sorry, at the moment we are only supporting the Berlin Corona Regulation.</p>",
    "inputs": [],
    "rules": {},
    "destination": {},
    "action": {}
  },
  "event-audience": {
    "name": "Event Audience",
    "text": "<p>Do you want to organise a public or private event?</p>\n\n<p>Definition of &#39;Public&#39;: The term &#39;public event&#39; covers all events held in places to which the public is admitted, either because of the nature of the place (e.g. discotheques) or because of the relationship between the organisers and the guests. Even if entrance fees are charged or tickets are sold, it is still a public event.</p>",
    "inputs": [
      {
        "type": "button",
        "display_as": "button",
        "label": "",
        "options": [
          "Private Event",
          "Public Event"
        ]
      }
    ],
    "rules": {},
    "destination": {
      "0": "event-location",
      "1": "placeholder-public-event"
    },
    "action": {}
  },
  "event-location": {
    "name": "Event Location",
    "text": "<p>Will the event take place in an enclosed space?</p>",
    "inputs": [
      {
        "type": "button",
        "display_as": "button",
        "label": "",
        "options": [
          "Yes",
          "No"
        ]
      }
    ],
    "rules": {},
    "destination": {
      "0": "no-of-guests",
      "1": "open-air"
    },
    "action": {}
  },
  "no-of-guests": {
    "name": "No. of Guests",
    "text": "<p>How many guests do you expect?</p>",
    "inputs": [
      {
        "type": "number",
        "label": ""
      }
    ],
    "rules": {
      "if": [
        {
          "<=": [
            {
              "var": "a"
            },
            300.0
          ]
        },
        "0",
        {
          ">": [
            {
              "var": "a"
            },
            300.0
          ]
        },
        "1"
      ]
    },
    "destination": {
      "0": "eventallowed",
      "1": "event-prohibited"
    },
    "action": {}
  },
  "event-prohibited": {
    "name": "Event Prohibited",
    "text": "<p>This feature is not yet supported.</p>",
    "inputs": [],
    "rules": {},
    "destination": {},
    "action": {}
  },
  "open-air": {
    "name": "Open Air",
    "text": "<p>This feature is not yet supported.</p>",
    "inputs": [],
    "rules": {},
    "destination": {},
    "action": {}
  },
  "placeholder-public-event": {
    "name": "Placeholder Public Event",
    "text": "<p>This feature is not yet supported.</p>",
    "inputs": [],
    "rules": {},
    "destination": {},
    "action": {}
  },
  "eventallowed": {
    "name": "EventAllowed",
    "text": "<p>You are allowed to hold your event in an enclosed space&nbsp;with&nbsp;[[no-of-guests]]&nbsp;guests. Note however, that you cannot have more than 300 guests present at the same time up to and&nbsp;<strong>including July 31, 2020.</strong></p>\n\n<p>This is an automatically generated advice which is based upon&nbsp;&sect; 6 (2) of the Berlin&nbsp;SARS-CoV-2 Infection Protection Ordinance from&nbsp;June 23, 2020.&nbsp;If there are new regulations which apply to your situation, you may find them&nbsp;<a href=\"https://www.berlin.de/corona/en/measures/directive/\">here</a>.</p>\n\n<p>For further advice, contact our&nbsp;<a href=\"https://www.berlin.de/corona/en/hotline/\">help center</a>.</p>",
    "inputs": [],
    "rules": {},
    "destination": {},
    "action": {}
  }
}