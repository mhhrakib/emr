$(document).ready(function() {
    $('#addEMRF').submit(addEMR);
});


//addEMR(userEmail, adderEmail, emrID, type, content)
const addEMR = function(event) {

    event.preventDefault();

    const formData = $('#addEMRF').serializeArray();
    const userEmail = formData[0].value;
    const adderEmail = formData[1].value;
    const emrID = formData[2].value;
    const type = "test";
    const content = formData[3].value;

    $.ajax({
        url: 'http://localhost:3003/lab/addEMR',
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
                $('#addEMRF').trigger("reset");
            } else {
                // $('#emrdata').val(resData);
                // $('#emrdata').display("inline");
                // $('#emrdata').css('display', 'inline');
                swal("Success", resData, "success");
            }
        },
        error: function(error) {
            swal("Oops", error.toString(), "error");
            console.log(error);
        }
    });
}
