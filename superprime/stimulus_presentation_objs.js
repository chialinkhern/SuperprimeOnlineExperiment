let in_data = {
    config: [],
    task: "",
    rp: "",
    soa: "",
    conditions: [],
    event_params: [],
    practice_stimuli: [],
    test_stimuli: [],
    list: "",
    list_num: "",
    block_names: [],
    num_blocks: null,
    num_trials_per_block: null, //TODO: if non-int, program might break
    key_codes: [],
    SubNum: Date.now()
}

let out_data = {
    StimType: [],
    SubNum: [],
    Task: [],
    List: [],
    RP: [],
    SOA: [],
    ListNum: [],
    Trial: [],
    Block: [],
    Prime: [],
    Target: [],
    Corr_response: [],
    Related: [],
    Block_Name: [],
    Target_cat: [],
    RT: [],
    Resp: []
    }


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*
*
* jspsych objects that implement misc features that we wanted in the experiment
*
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


let consent_form = {
    type:'external-html',
    url: "http://lachia2.web.illinois.edu/repositories/SuperprimeOnlineExperiment/KaraConsentForm.html",
    cont_btn: "start",
    check_fn: check_consent
}

let fullscreen = {
    type: 'fullscreen',
    fullscreen_mode: true,
}

let get_block_stimuli = {
    type: "call-function",
    func: function(){
        console.log("practice block num = " + String(present_superprime.practice_block_num))
        console.log("test block num = " + String(present_superprime.test_block_num))
        iterate_trials.percentage_correct = null
        if (present_superprime.practice===true){
            present_superprime.block_name = "PRACTICE"
            if (iterate_practice_blocks.practice_trial_num+1 < in_data.practice_stimuli.length/2){
                // indexing first half (because first half comes with feedback)
                present_block.block_stimuli = in_data.practice_stimuli.slice(0, in_data.practice_stimuli.length/2)
                iterate_practice_blocks.feedback = true
            }
            else {
                // indexing second half (second half does not come with feedback)
                present_block.block_stimuli = in_data.practice_stimuli.slice((in_data.practice_stimuli.length/2), in_data.practice_stimuli.length)
                iterate_practice_blocks.feedback = false
            }
        }
        else {
            present_superprime.block_name = in_data.block_names[present_superprime.test_block_num]
            if (in_data.task==="cd"){
                present_block.block_stimuli = in_data.test_stimuli.filter(x => x.Block_Name===present_superprime.block_name)
            }
            else if (in_data.task==="ad"){
                present_block.block_stimuli = in_data.test_stimuli.splice(0, in_data.num_trials_per_block)
            }
        }
        console.log(present_block.block_stimuli)
    }
}

let get_trial_info = {
    type: "call-function",
    func: function(){
        present_trial.event_types = Object.keys(in_data.event_params)
        present_trial.trial_events = present_block.block_stimuli[iterate_trials.trial_num]
        present_text.correct_response = parseInt(present_block.block_stimuli[iterate_trials.trial_num]["Corr_response"])
    }
}

let initialize_experiment_vars = {
        type: "call-function",
        func: load_csvs
    }

let if_not_fullscreen = {
    timeline: [fullscreen],
    conditional_function: function(){
      let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement ||
          document.webkitFullscreenElement || document.msFullscreenElement;
      return fullscreenElement == null
    }
}

let warning = {
    type: 'html-keyboard-response2',
    stimulus: 'Please respond quickly. Press the spacebar to continue.',
    stimulus_duration: null,
    trial_duration: null,
    response_ends_trial: true,
    choices: [" "]
}

let if_no_response = {
    timeline: [warning],
    conditional_function: function(){
        return !present_trial.response_logged
    }
}

let practice_mode = {
    type: "call-function",
    func: switch_to_practice
}

let test_mode = {
    type: "call-function",
    func: switch_to_test
}

let resize_text = {
    type:"clk-resize-text",
    stimulus: "ResizeMe",
    min: 20,
    max: 35,
    start: 24
}

let thresholded_boot = {
    timeline: [boot],
    conditional_function: function(){
        if (iterate_trials.percentage_correct <= 0.65 && !(present_superprime.practice)){
            return true
        }
        else {return false}
    }
}

let feedback = {
    type: "html-keyboard-response2",
    stimulus: "",
    stimulus_duration: 5000, //TODO: take from config/whatever
    trial_duration: 5000, //TODO: same here
    response_ends_trial: false,
    on_start: function(trial){
        if (in_data.task==="ad"){ //TODO: yo this needs to be tested
            if (present_text.correct_response===1){
                if (present_text.response_correct){
                    trial.stimulus = `Correct! The second ${general_instructions.stim} is a real, physical, object.`
                }
                else {trial.stimulus = `Wrong! The second ${general_instructions.stim} IS a real, physical, object.`}
            }
            else if (present_text.correct_response===2){
                if (present_text.response_correct){
                    trial.stimulus = `Correct! The second ${general_instructions.stim} is NOT a real, physical, object.`
                }
                else {trial.stimulus = `Wrong! The second ${general_instructions.stim} is NOT a real, physical, object.`}
            }
        }
        else if (in_data.task===`cd`){
            if (present_text.correct_response===1){
                if (present_text.response_correct){
                    trial.stimulus = `Correct! The second ${general_instructions.stim} is part of the category.`
                }
                else {trial.stimulus = `Wrong! The second ${general_instructions.stim} IS part of the category.`}
            }
            else if (present_text.correct_response===2){
                if (present_text.response_correct){
                    trial.stimulus = `Correct! The second ${general_instructions.stim} is NOT part of the category`
                }
                else {trial.stimulus = `Wrong! The second ${general_instructions.stim} is NOT part of the category.`}
            }
        }
    }
}

let if_feedback = {
    timeline: [feedback],
    conditional_function: function(){
        return iterate_practice_blocks.feedback
    }
}

let language_survey = {
    type:'call-function',
    func: function(){
        language_survey_link = "https://illinoislas.qualtrics.com/jfe/form/SV_eDLN14jCExIQiQl"+"?SubNum="+String(in_data.SubNum);
        window.location = language_survey_link;
    },
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*
*
* hierarchically-structured stimulus presentation objects
*
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

let present_text = {
    type: "html-keyboard-response2",
    stimulus: "",
    stimulus_duration: 40,
    trial_duration: 40,
    correct_response: null,
    response_correct: null,
    choices: null,
    response_ends_trial: false,
    on_start: function(trial){
        trial.stimulus = present_trial.trial_events[present_trial.event_types[iterate_events.event_num]]
        trial.stimulus_duration = parseInt(in_data.event_params[present_trial.event_types[iterate_events.event_num]])
        trial.trial_duration = parseInt(in_data.event_params[present_trial.event_types[iterate_events.event_num]])
        if (present_trial.event_types[iterate_events.event_num] === "Target"){
            trial.choices = in_data.key_codes
            console.log(trial.choices) //TODO remove
            trial.response_ends_trial = true
        }
        else if (present_trial.event_types[iterate_events.event_num]==="ITI"){
            trial.choices = []
            trial.response_ends_trial = false
            trial.stimulus = ""
        }
        else {
            trial.choices = []
            trial.response_ends_trial = false
        }
    },
    on_finish: function(data){
        if (present_trial.event_types[iterate_events.event_num] === "Target"){
            // logs if response was collected and transforms resp if yes
            if (data.response !== null){
                if (in_data.key_codes.includes(data.response.toLowerCase())){
                    present_trial.response_logged = true
                }

            // converts J|K keypresses into 1|2
                if (data.response.toLowerCase()===in_data.key_codes[0].toLowerCase()){
                    data.response = 1
                }
                else if (data.response.toLowerCase()===in_data.key_codes[1].toLowerCase()){
                    data.response = 2
                }
            }
            else {present_trial.response_logged = false}

            // logs if response was correct and keeps running log of percentage correct in present_block
            if (data.response === present_text.correct_response){
                present_text.response_correct = true
                iterate_trials.num_correct = iterate_trials.num_correct + 1
            }
            else {present_text.response_correct = false}

            // pushes participant data to JSON for saving
            out_data.StimType.push(in_data.stim_type)
            out_data.SubNum.push(in_data.SubNum)
            out_data.List.push(in_data.list)
            out_data.Task.push(in_data.task)
            out_data.RP.push(in_data.rp)
            out_data.ListNum.push(in_data.list_num)
            out_data.SOA.push(in_data.soa)
            out_data.Trial.push(present_superprime.trial_num) //TODO: write in present_superprime.trial_num
            out_data.Block.push(present_superprime.block_num) //TODO: write in attribute
            out_data.Prime.push(present_trial.trial_events.Prime)
            out_data.Target.push(present_trial.trial_events.Target)
            out_data.Corr_response.push(present_trial.trial_events.Corr_response)
            out_data.Related.push(present_trial.trial_events.Related)
            out_data.Block_Name.push(present_trial.trial_events.Block_Name)
            out_data.Target_cat.push(present_trial.trial_events.Target_cat)
            out_data.RT.push(data.rt)
            out_data.Resp.push(data.response)

            iterate_trials.percentage_correct = iterate_trials.num_correct/(iterate_trials.trial_num+1)
            console.log(iterate_trials.percentage_correct)
        }
    }
}


let present_image = {
    type:"image-keyboard-response2",
    stimulus: "Stimuli/images/blank.jpg",
    stimulus_duration: 40,
    trial_duration: 40,
    response_ends_trial: false,
    render_on_canvas: true,
    on_start: function(trial){
        trial.stimulus_duration = parseInt(in_data.event_params[present_trial.event_types[iterate_events.event_num]])
        trial.trial_duration = parseInt(in_data.event_params[present_trial.event_types[iterate_events.event_num]])

        if (present_trial.event_types[iterate_events.event_num] === "Target" |
            present_trial.event_types[iterate_events.event_num] === "Prime"){
            let img_name = present_trial.trial_events[present_trial.event_types[iterate_events.event_num]]
            trial.stimulus = "Stimuli/images/" + img_name + ".jpg"
            if (present_trial.event_types[iterate_events.event_num] === "Target"){
                trial.choices = in_data.key_codes
                trial.response_ends_trial = true
            }
        }
        else if (present_trial.event_types[iterate_events.event_num] === "Mask"){
            trial.stimulus = shuffle(["Stimuli/images/mask_ant.jpg", "Stimuli/images/mask_carp.jpg", "Stimuli/images/mask_daffodil.jpg",
    "Stimuli/images/mask_firestation.jpg", "Stimuli/images/mask_goldfish.jpg", "Stimuli/images/mask_guitar.jpg",
    "Stimuli/images/mask_house.jpg", "Stimuli/images/mask_legos.jpg", "Stimuli/images/mask_maple.jpg",
    "Stimuli/images/mask_mixer.jpg", "Stimuli/images/mask_oak.jpg", "Stimuli/images/mask_piano.jpg",
    "Stimuli/images/mask_pot.jpg", "Stimuli/images/mask_prayingmantis.jpg", "Stimuli/images/mask_sunflower.jpg",
     "Stimuli/images/mask_teddybear.jpg"])[0]
        }
        else if (present_trial.event_types[iterate_events.event_num] === "Fixation"){
            trial.stimulus = "Stimuli/images/fixation.jpg"
        }
        else if (present_trial.event_types[iterate_events.event_num]==="ITI"){
            trial.choices = []
            trial.response_ends_trial = false
            trial.stimulus = null
        }
    },
    on_finish: function(data) {
        if (present_trial.event_types[iterate_events.event_num] === "Target") {

            // logs if response was collected and transforms resp if yes
            if (data.response !== null){
                if (in_data.key_codes.includes(data.response.toLowerCase())){
                    present_trial.response_logged = true
                }

            // converts J|K keypresses into 1|2
                if (data.response.toLowerCase()===in_data.key_codes[0].toLowerCase()){
                    data.response = 1
                }
                else if (data.response.toLowerCase()===in_data.key_codes[1].toLowerCase()){
                    data.response = 2
                }
            }
            else {present_trial.response_logged = false}


            // logs if response was correct and keeps running log of percentage correct in present_block
            if (data.response === present_text.correct_response) {
                present_text.response_correct = true
                iterate_trials.num_correct = iterate_trials.num_correct + 1
            } else {
                present_text.response_correct = false
            }

            // pushes participant data to JSON for saving
            out_data.StimType.push(in_data.stim_type)
            out_data.SubNum.push(in_data.SubNum)
            out_data.List.push(in_data.list)
            out_data.Task.push(in_data.task)
            out_data.RP.push(in_data.rp)
            out_data.ListNum.push(in_data.list_num)
            out_data.SOA.push(in_data.soa)
            out_data.Trial.push(present_superprime.trial_num) //TODO: write in present_superprime.trial_num
            out_data.Block.push(present_superprime.block_num) //TODO: write in attribute
            out_data.Prime.push(present_trial.trial_events.Prime)
            out_data.Target.push(present_trial.trial_events.Target)
            out_data.Corr_response.push(present_trial.trial_events.Corr_response)
            out_data.Related.push(present_trial.trial_events.Related)
            out_data.Block_Name.push(present_trial.trial_events.Block_Name)
            out_data.Target_cat.push(present_trial.trial_events.Target_cat)
            out_data.RT.push(data.rt)
            out_data.Resp.push(data.response)

            iterate_trials.percentage_correct = iterate_trials.num_correct / (iterate_trials.trial_num + 1)
            console.log(iterate_trials.percentage_correct)
        }
    }
}


let preload_images = {
    type: "preload",
    images: function(){return get_image_names()},
    show_preload_progress_bar: true,
    message: " Loading images. Please wait...",
    error_message: "Please contact researcher. The following images failed to load: ",
    continue_after_error: true,
    show_detailed_errors: true,
    max_load_time: 60000, // 1 minute
}

let if_preload = {
    timeline: [preload_images],
    conditional_function: function(){
        if (in_data.stim_type === "PP"){return true}
        else {return false}
    }
}

let if_text = {
    timeline: [present_text],
    conditional_function: function(){
        if (in_data.stim_type === "WW"){return true}
        else {return false}
    }
}

let if_image = {
    timeline: [present_image],
    conditional_function: function(){
        if (in_data.stim_type === "PP"){return true}
        else {return false}
    }
}

let iterate_events = {
  timeline: [if_text, if_image],
  event_num: 0,
  loop_function: function(){
      iterate_events.event_num = iterate_events.event_num + 1
      if (iterate_events.event_num===present_trial.event_types.length){
          iterate_events.event_num = 0
          return false
      }
      else {return true}
  }
}

let present_trial = {
  timeline: [get_trial_info, iterate_events],
  trial_events: [],
  event_types: [],
  response_logged: null,
}

let iterate_trials = {
    timeline: [if_not_fullscreen, present_trial, if_feedback, if_no_response],
    trial_num: 0,
    num_correct: 0,
    percentage_correct: null,
    loop_function: function(){
        iterate_trials.trial_num = iterate_trials.trial_num + 1
        present_superprime.trial_num = present_superprime.trial_num + 1
        if (present_superprime.practice){
            iterate_practice_blocks.practice_trial_num += 1
        }
        if (iterate_trials.trial_num===present_block.block_stimuli.length){
            iterate_trials.trial_num = 0
            iterate_trials.num_correct = 0
            if (iterate_trials.percentage_correct >= 0.65){
                present_superprime.num_bad_blocks = 0
                }
            else if (iterate_trials.percentage_correct < 0.65 && !(present_superprime.practice)) {
                present_superprime.num_bad_blocks = present_superprime.num_bad_blocks + 1
            }

            if (present_superprime.practice){
                present_superprime.practice_block_num = present_superprime.practice_block_num + 1
            }
            else {present_superprime.test_block_num = present_superprime.test_block_num + 1}

            present_superprime.block_num = present_superprime.block_num + 1
            return false  // ends the iteration and moves experiment on to next block
        }
        else {return true}
    }
}

let present_block = {
    timeline: [get_block_stimuli, iterate_trials, thresholded_boot],
    block_stimuli: [],
}

let iterate_test_blocks = {
  timeline: [test_mode, block_instructions, present_block],
  loop_function: function(){
      console.log("block_num: " + String(present_superprime.test_block_num))
      if (in_data.task==="cd"){
          console.log(String(present_superprime.test_block_num) + "/" + String(in_data.block_names.length))
          return present_superprime.test_block_num < in_data.block_names.length
      }
      else if (in_data.task==="ad"){
          return present_superprime.test_block_num < in_data.num_blocks
      }
  }
}

let iterate_practice_blocks = {
    timeline: [practice_mode, present_block, practice_mid_instructions,
       present_block, practice_end_instructions],
    feedback: false,
    practice_trial_num: 0
}

let present_superprime = {
    timeline: [general_instructions, task_instructions,
        iterate_practice_blocks, iterate_test_blocks],
    block_name: "",
    practice: true, // set to false by iterate_test_blocks
    practice_block_num: 0,
    test_block_num: 0,
    trial_num: 0,
    block_num: 0,
    num_bad_blocks: 0,
}