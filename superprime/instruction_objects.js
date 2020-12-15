//instructions
let general_instructions = {
  type: "instructions",
  pages: [
  "Hello. Welcome to our experiment.",

  "<p>In this experiment, you will see a series of experimental trials. </p>" +
  "<p>At the beginning of each trial, you will see a '+' symbol telling you to pay attention, because the trial is about to begin. </p>" +
  "<p>Each trial will consist of the following sequence, which you will see on the screen: " +
  "<p>(1) The '+' symbol </p>" +
  "<p>(2) A word, which will disappear very quickly </p>" +
  "<p>(3) A second word </p>" +
  "<p>Your task will be to make a decision (which we will describe on the next page) about the second word in each sequence. </p>",
  ],
  show_clickable_nav : true,
}

//this set of instructions changes depending on the task
let task_instructions = {
  type: "instructions",
  pages: [],
  on_start: function(trial) {
    if (in_data.task === "ad") {
      trial.pages = ["<p>The decision you need to make is: </p>"+
      "<p>is the second word a real, physical object (like a dog or a shoe or a cloud) " +
      "or is it an abstract idea or concept (like truth or love or beauty)? </p>" +
      "<p>Some words (like the examples) are pretty easy to decide. Others are not as easy. </p>" +
      "<p>You will just need to make the best choice you can, as quickly as you can. </p>",

      "<p>You will make your decision by pressing the J and K keys on the keyboard. If you think the second word is a real, physical object, press the J key as quickly as you can. If you think it is an abstract concept, press the K key as quickly as you can. </p>" +
      "<p>There will be a few practice trials so that you can get the hang of the experiment. </p>",

      "<p>When you are ready to start the practice trials, make sure your dominant hand is in position, with your fingers resting on the J and K keys.</p>" +
      "<p>REMEMBER: J means real, concrete object, K means abstract concept. You are making the decision about the SECOND word; do not press a key until the SECOND word appears.</p>"+
      "<p>Click next to begin.</p>"];
    }
    else if (in_data.task === "cd") {
      trial.pages = ["On each trial, you will be deciding if the second word (and only the second word) is a member of a particular category. " +
      "Throughout the experiment, the category you are being asked about will change from time to time. Please make sure to pay attention to the instructions giving the category at the beginning of each set ",

      "You will make your decision by pressing the J and K keys on the keyboard. " +
      "If you think the second word is a member of the category you are being asked about, press J. If you think it is not a member of the category, press K. " +
      "<p>For example, let's say you've been asked to decide if the second word is a type of flower. If the second word was 'tulip' you should press J. If 'spoon' you should press K.</p>" +
      "<p>The next slide will inform you what category you will be using to make your decision. There will be a few practice trials so you that can get the hang of the experiment. </p>",

      "In the following practice trials, you will be deciding if the second word is a flower. " +
      "<p>Press J if the second word is a flower. </p>"+
      "<p>Press K if the second word is not a flower. </p>" +
      "<p>In order to make these decisions quickly and accurately, please place your dominant hand on the J and K keys, resting your fingers on them so you can quickly respond.<br>REMEMBER: You are making the decision about the SECOND word; do not press a key until the SECOND word appears.</p>" +
      "<p>Click next to begin.</p>"]
    }
  },
  show_clickable_nav : true
}

let practice_mid_instructions = {
  type: "instructions",
  pages: [
      "Good Job! You will now do some practice trials without feedback.",
      "When you are ready, put your dominant hand's fingers on the J and K keys, and press the next button to begin."
  ],
  show_clickable_nav:true
}

let practice_end_instructions = {
  type: "instructions",
  pages: [
      "Good Job! There will be 128 test trials. The entire experiment usually takes less than 10 minutes. We will be keeping track of how many you get correct, and also how quickly you can make the response; so please make your responses as quickly and as accurately as possible. ",
      "<p>The task we ask of you in this experiment is easy. We typically find that engaged participants achieve a score of more than 70% per block. Therefore, be aware that we reserve the right to withhold payment if your performance is unsatisfactory.</p>"
  ],
  show_clickable_nav: true,
}

let block_instructions = {
  type: 'instructions',
  pages: ['ins'],
  show_clickable_nav : true,
  on_start: function(trial) {
    present_superprime.block_name = in_data.block_names[present_superprime.test_block_num]
    if (present_superprime.block_name === "TEST") {
      trial.pages = ["You will now complete 16 trials. When you are ready, press the next button to begin. " +
      "<p>Remember: J means yes, the second word is a real, physical object. K means no, the second word is NOT a real, physical object.</p>" +
      "<p>When you are ready, put your dominant hand's fingers on the J and K keys and press the next button to begin.</p>"]
    }
    else if (present_superprime.block_name === "BIRD") {
      trial.pages = ["In the following trials, you will be deciding if the second word is a BIRD. Press J if the second word is a BIRD. Press K if the second word is not a BIRD." +
      "<p>When you are ready, put your dominant hand's fingers on the J and K keys and press the next button to begin.</p>"]
    }
    else if (present_superprime.block_name === "CLOTHING") {
      trial.pages = ["In the following trials, you will be deciding if the second word is a type of CLOTHING. Press J if the second word is a type of CLOTHING. Press K if the second word is not a type of CLOTHING." +
      "<p>When you are ready, put your dominant hand's fingers on the J and K keys and press the next button to begin.</p>"];
    }
    else if (present_superprime.block_name === "FRUIT") {
      trial.pages = ["In the following trials, you will be deciding if the second word is a FRUIT. Press J if the second word is a FRUIT. Press K if the second word is not a FRUIT." +
      "<p>When you are ready, put your dominant hand's fingers on the J and K keys and press the next button to begin.</p>"];
    }
    else if (present_superprime.block_name === "MAMMAL") {
      trial.pages = ["In the following trials, you will be deciding if the second word is a MAMMAL. Press J if the second word is a MAMMAL. Press K if the second word is not a MAMMAL." +
      "<p>When you are ready, put your dominant hand's fingers on the J and K keys and press the next button to begin.</p>"];
    }
    else if (present_superprime.block_name === "TOOL") {
      trial.pages = ["In the following trials, you will be deciding if the second word is a TOOL. Press J if the second word is a TOOL. Press K if the second word is not a TOOL." +
      "<p>When you are ready, put your dominant hand's fingers on the J and K keys and press the next button to begin.</p>"];
    }
    else if (present_superprime.block_name === "VEGETABLE") {
      trial.pages = ["In the following trials, you will be deciding if the second word is a VEGETABLE. Press J if the second word is a VEGETABLE. Press K if the second word is not a VEGETABLE." +
      "<p>When you are ready, put your dominant hand's fingers on the J and K keys and press the next button to begin.</p>"];
    }
    else if (present_superprime.block_name === "VEHICLE") {
      trial.pages = ["In the following trials, you will be deciding if the second word is a VEHICLE. Press J if the second word is a VEHICLE. Press K if the second word is not a VEHICLE." +
      "<p>When you are ready, put your dominant hand's fingers on the J and K keys and press the next button to begin.</p>"];
    }
    else if (present_superprime.block_name === "WEAPON") {
      trial.pages = ["In the following trials, you will be deciding if the second word is a WEAPON. Press J if the second word is a WEAPON. Press K if the second word is not a WEAPON." +
      "<p>When you are ready, put your dominant hand's fingers on the J and K keys and press the next button to begin.</p>"];
    }
  }
}

// Text resizing plug-in
let resize_text_instructions = {
  type: "instructions",
  pages: ["You will be looking at words one at a time in this experiment. Use the next page to resize the words to your comfort."],
  show_clickable_nav: true
}

let boot = {
    type: "instructions",
    pages: ["ins"],
    show_clickable_nav: true,
    on_start: function(trial){
        if (present_superprime.num_bad_blocks<2){
            trial.pages = ["Your performance for this block was unsatisfactory. If you do not increase your accuracy, we will terminate the experiment."]
        }
        else {
            trial.pages = ["You have performed too poorly to remain in the experiment. Your participation ends here."]
            trial.show_clickable_nav = false
        }
    }
}