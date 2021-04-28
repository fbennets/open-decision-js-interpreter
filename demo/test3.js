test = {
  "header": {
    "version": 0.1,
    "build_date": "2021-01-16",
    "tree_name": "test",
    "tree_slug": "test",
    "start_node": "begruung",
    "vars": {}
  },
  "end": {
    "name": "end",
    "text": "<p>[[begruung]]</p>\n\n<p>Hallo&nbsp;[[poor]],</p>\n\n<p>es tut mir leid, dass es dir schlecht geht</p>",
    "inputs": [],
    "rules": {},
    "destination": {},
    "action": {}
  },
  "frage-1": {
    "name": "frage 1",
    "text": "<p>Wie geht es dir? (1-10)</p>",
    "inputs": [
      {
        "type": "number",
        "label": ""
      }
    ],
    "rules": {
      "if": [
        {
          "<": [
            {
              "var": "a"
            },
            4.0
          ]
        },
        "0",
        {
          ">=": [
            {
              "var": "a"
            },
            4.0
          ]
        },
        "1"
      ]
    },
    "destination": {
      "0": "poor",
      "1": "good"
    },
    "action": {}
  },
  "begruung": {
    "name": "begr\u00fc\u00dfung",
    "text": "<p><strong>Willkommen!</strong></p>\n\n<p><strong>daslds</strong></p>",
    "inputs": [
      {
        "type": "button",
        "display_as": "button",
        "label": "",
        "options": [
          "Weiter"
        ]
      }
    ],
    "rules": {},
    "destination": {
      "0": "frage-1"
    },
    "action": {}
  },
  "good": {
    "name": "good",
    "text": "",
    "inputs": [
      {
        "type": "button",
        "display_as": "button",
        "label": "",
        "options": [
          "EMPTY"
        ]
      }
    ],
    "rules": {},
    "destination": {},
    "action": {}
  },
  "poor": {
    "name": "poor",
    "text": "<p>Wie hei&szlig;t du?</p>",
    "inputs": [
      {
        "type": "free_text",
        "validation": "short_text",
        "label": "Hello",
        "id": "hello"
      }
    ],
    "rules": {},
    "destination": {
      "default": "end"
    },
    "action": {}
  }
}