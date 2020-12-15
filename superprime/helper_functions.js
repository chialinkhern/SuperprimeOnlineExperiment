function load_csvs(){
    Papa.parse("superprime/config.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results){
            in_data.config = results["data"][0]
            in_data.task = pick_task(in_data.config["TASK"])
            in_data.key_codes = in_data.config["KEY"].split(" ").map(function(x){return parseInt(x)})
            in_data.num_blocks = parseInt(in_data.config["BLOCKS"])
            Papa.parse("superprime/conditions.csv", {
                download: true,
                header: true,
                skipEmptyLines: true,
                complete: function(results){
                    in_data.conditions = results["data"][0]
                    in_data.list = pick_list(in_data.task, in_data.conditions["items"])
                    Papa.parse("superprime/event_params/"+in_data.conditions["trial_events"]+".csv", {
                        download: true,
                        header: true,
                        skipEmptyLines: true,
                        complete: function(results){
                            in_data.event_params = results["data"][0]
                            in_data.rp = in_data.list.split("_")[1]
                            in_data.list_num = in_data.list.split("_")[2]
                            in_data.soa = parseInt(in_data.event_params["Prime"]) + parseInt(in_data.event_params["Mask"])
                            Papa.parse("Stimuli/Item_Lists/" + in_data.list + ".csv", {
                                download: true,
                                header: true,
                                skipEmptyLines: true,
                                complete: function(results){
                                    in_data.block_names = get_uniques(results["data"], "Block_Name")
                                    if (in_data.task==="ad"){
                                        in_data.block_names = new Array(in_data.num_blocks).fill(in_data.block_names).flat()
                                    }
                                    if (in_data.config["RAND_BLOCKS"]==="TRUE"){
                                        in_data.block_names = shuffle(in_data.block_names).filter(x => x!=="PRACTICE")
                                    }
                                    if (in_data.config["RAND_WITHIN_BLOCKS"]==="TRUE"){
                                        results["data"] = shuffle(results["data"])
                                    }
                                    in_data.test_stimuli = results["data"].filter(x => x.Block_Name!=="PRACTICE")
                                    in_data.practice_stimuli = results["data"].filter(x => x.Block_Name==="PRACTICE")
                                    in_data.num_trials_per_block = in_data.test_stimuli.length/in_data.num_blocks
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

function shuffle(array) { //Fisher-Yates (aka Knuth) Shuffle; taken from stackoverflow
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function check_consent(elem) {
  if ($('#consent_checkbox').is(':checked')) {
    return true;
  }
  else {
    alert("If you wish to participate, you must check the box that indicates your consent.");
    return false;
  }
}

function pick_task(tasks){
    tasks = tasks.split(" ")
    task = jsPsych.randomization.sampleWithoutReplacement(tasks, 1)
    return task[0]
}

function pick_list(task, lists){
    lists = lists.split(" ")
    filtered_list = lists.filter(function(lists){return lists.includes(task)})
    list = jsPsych.randomization.sampleWithoutReplacement(filtered_list, 1)
    return list[0]
}

function get_uniques(array_of_objs, property){
    let uniques = []
    for (let i = 0; i < array_of_objs.length; i++){
        if (!(uniques.includes(array_of_objs[i][String(property)]))){
            uniques.push(array_of_objs[i][String(property)])
        }
    }
    return uniques
}

function switch_to_practice(){
    present_superprime["practice"] = true
}

function switch_to_test(){
    present_superprime["practice"] = false
}

function prep_data(data) { // Trisha's function
    var datacsv = "";
    var labels = Object.keys(data); //grabs all the properties of data

    for (n = 0; n < labels.length; n++){
        datacsv = datacsv + labels[n] + ',';
        }
    datacsv = datacsv + '\n';

    let ntoloop = data[Object.keys(data)[0]].length;
    for (n = 0; n < ntoloop; n++){
        for (var i in data){
            if (data.hasOwnProperty(i)){
                datacsv = datacsv + data[i][n] + ','; //in "str" + num, num is converted to a string.
                }
            }
        datacsv = datacsv + '\n';
        }
    console.log(datacsv)
    return datacsv;
    }

function save_data(name, data){
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'superprime/write_data.php'); // 'write_data.php' is the path to the php file
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({filename: name, filedata: data}));
}