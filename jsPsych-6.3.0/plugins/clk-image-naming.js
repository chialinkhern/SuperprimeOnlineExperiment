jsPsych.plugins["image-naming"] = (function() { //TODO: change all the names, boi

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('clk-image-naming', 'stimulus', 'image'); //TODO: what does this do? Do I have to change it?

  plugin.info = {
    name: 'clk-image-naming',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        default: undefined,
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'Prompt for the subject to response'
          },
          value: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Value',
            default: "",
            description: 'The string will be used to populate the response field with editable answer.'
          },
          rows: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Rows',
            default: 1,
            description: 'The number of rows for the response text box.'
          },
          columns: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Columns',
            default: 40,
            description: 'The number of columns for the response text box.'
          },
          required: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Required',
            default: false,
            description: 'Require a response'
          }
        }
      },
    }
  }

  plugin.trial = function(display_element, trial) {
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].rows == 'undefined') {
        trial.questions[i].rows = 1;
        }
      }
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].columns == 'undefined') {
        trial.questions[i].columns = 40;
        }
      }
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].value == 'undefined') {
        trial.questions[i].value = "";
        }
      }

    var new_html = '<img src="'+trial.stimulus+'" id="jspsych-image-keyboard-response-stimulus"></img>';

    // start form TODO: This is the text box
    new_html += '<form id="jspsych-survey-text-form">'
    // add questions
    for (var i = 0; i < trial.questions.length; i++) {
      new_html += '<div id="jspsych-survey-text-'+i+'" class="jspsych-survey-text-question" style="margin: 2em 0em;">';
      new_html += '<p class="jspsych-survey-text">' + trial.questions[i].prompt + '</p>';
      var autofocus = i == 0 ? "autofocus" : "";
      var req = trial.questions[i].required ? "required" : "";
      if(trial.questions[i].rows == 1){
        new_html += '<input type="text" name="#jspsych-survey-text-response-' + i + '" size="'+trial.questions[i].columns+'" value="'+trial.questions[i].value+'" '+autofocus+' '+req+'></input>';
      } else {
        new_html += '<textarea name="#jspsych-survey-text-response-' + i + '" cols="' + trial.questions[i].columns + '" rows="' + trial.questions[i].rows + '" '+autofocus+' '+req+'>'+trial.questions[i].value+'</textarea>';
      }
      new_html += '</div>';
    }

    // add submit button
    new_html += '<input type="submit" id="jspsych-survey-text-next" class="jspsych-btn jspsych-survey-text" value="'+trial.button_label+'"></input>';
    new_html += '</form>'

    // draw
    display_element.innerHTML = new_html;

    // store response TODO: add response attribute to object

    // create object to hold responses
    var response = {
      rt: null
    };
    var question_data = {};
    var matches = display_element.querySelectorAll('div.jspsych-survey-text-question');
    for(var index=0; index<matches.length; index++){
      var id = "Q" + index;
      var val = matches[index].querySelector('textarea, input').value;
      var obje = {};
      obje[id] = val;
      Object.assign(question_data, obje);
    };

    // function to end trial when it is time
    var end_trial = function() { // TODO: find a way to store and return the response attribute

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "responses": JSON.stringify(question_data)
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) { //TODO: don't think you need this

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-image-keyboard-response-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-image-keyboard-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();