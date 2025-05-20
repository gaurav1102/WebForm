/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var Project_database = "COLLEGE-DB";
var Project_relation = "PROJECT-TABLE";
var connToken = "90934654|-31949206962299054|90956488";

$("#project_id").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getProjectIdAsJsonObj() {
    var project_id = $("#project_id").val();
    var jsonStr = {
        project_id: project_id
    };
    return JSON.stringify(jsonStr);
}
function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;

    // Fill the form with existing record data
    $("#project_name").val(data.project_name);
    $("#assigned_to").val(data.assigned_to);
    $("#submit_on").val(data.submit_on);
    $("#deadline").val(data.deadline);
    
    // Disable Save to prevent duplicates
    $("#save").prop("disabled", true);
    // Enable Change and Reset to allow updates
    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);

    // Lock Project ID so user doesn't change it accidentally
    $("#project_id").prop("disabled", true);

    alert("Project ID already exists. Loaded existing data for update.");
}
function resetForm() {
    $("#project_id").val("");
    $("#project_name").val("");
    $("#assigned_to").val("");
    $("#submit_on").val("");
    $("#deadline").val("");
    

    $("#project_id").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);

    $("#project_id").focus();
}
function validateData() {
    var project_id, project_name, assigned_to, submit_on, deadline, deduct;
    project_id = $("#project_id").val();
    project_name = $("#project_name").val();
    assigned_to = $("#assigned_to").val();
    submit_on = $("#submit_on").val();
    deadline = $("#deadline").val();

    if (project_id === "") {
        alert("project ID missing");
        $("#project_id").focus();
        return "";
    }

    if (project_name === "") {
        alert("project Name missing");
        $("#project_name").focus();
        return "";
    }

    if (assigned_to === "") {
        alert("assigned to missing");
        $("#assigned_to").focus();
        return "";
    }

    if (submit_on === "") {
        alert("submit on missing");
        $("#submit_on").focus();
        return "";
    }

    if (deadline === "") {
        alert("deadline missing");
        $("#deadline").focus();
        return "";
    }

    var jsonStrObj = {
        project_id: project_id,
        project_name: project_name,
        assigned_to: assigned_to,
        submit_on: submit_on,
        deadline: deadline
    };

    return JSON.stringify(jsonStrObj);
}

function getProject() {
var projIdJsonObj = getProjectIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, Project_database, Project_relation, projIdJsonObj);

    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    console.log("GET Response: ", resJsonObj);  // Helpful for debugging

    if (resJsonObj.status === 400) {
        // ID not found → new entry
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#change").prop("disabled", true);
        $("#project_name").focus();
    } else if (resJsonObj.status === 200) {
        // ID exists → load and disable Save
        fillData(resJsonObj);
    } else {
        alert("Error fetching data. Try again.");
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }

    var putRequest = createPUTRequest(connToken, jsonStrObj, Project_database, Project_relation);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    resetForm();
    $("#project_id").focus();
}
function changeData() {
    $("#change").prop("disabled", true);

    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(
        connToken,
        jsonChg,
        Project_database,
        Project_relation,
        localStorage.getItem("recno")
    );

    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    console.log(resJsonObj);
    resetForm();
    $("#project_id").focus();
}