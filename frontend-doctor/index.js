$(document).ready(function() {
    $('#addEMRF').submit(addEMR);
    $('#viewEMRF').submit(getEMR);
});


//addEMR(userEmail, adderEmail, emrID, type, content)
const addEMR = function(event) {

    event.preventDefault();

    const formData = $('#addEMRF').serializeArray();
    const userEmail = formData[0].value;
    const adderEmail = formData[1].value;
    const emrID = formData[2].value;
    const type = "medical";
    const content = formData[3].value;

    $.ajax({
        url: 'http://localhost:3002/doctor/addEMR',
        method: 'POST',
        data: JSON.stringify({
            userEmail: userEmail,
            adderEmail: adderEmail,
            emrID: emrID,
            type: type,
            content: content
        }),
        contentType: 'application/json',
        success: function(resData) {
            if ((resData.toString().indexOf("Error:") != -1)) {
                //alert(resData);
                swal("Oops", resData, "error");
            } else {
                // $('#emrdata').val(resData);
                // $('#emrdata').display("inline");
                // $('#emrdata').css('display', 'inline');
                swal("Success", resData, "success");
                $('#addEMRF').trigger("reset");
            }
        },
        error: function(error) {
            swal("Oops", error.toString(), "error");
            console.log(error);
        }
    });
}



// async getEMR(ctx, emrID, email)
const getEMR = function(event) {

    event.preventDefault();

    const formData = $('#viewEMRF').serializeArray();
    console.log(formData);
    const emrID = formData[0].value;
    const userEmail = formData[1].value;

    $.ajax({
        url: 'http://localhost:3002/doctor/getEMR',
        method: 'POST',
        data: JSON.stringify({
            emrID: emrID,
            userEmail: userEmail
        }),
        contentType: 'application/json',
        success: function(resData) {
            if ((resData.toString().indexOf("Error:") != -1)) {
                //alert(resData);
                swal("Oops", resData, "error");
                $('#emrdata').css('display', 'none');
            } else {
                $('#emrdata').val(resData);
                // $('#emrdata').display("inline");
                $('#emrdata').css('display', 'inline');
            }
        },
        error: function(error) {
            swal("Oops", error.toString(), "error");
            console.log(error);
        }
    });
}

