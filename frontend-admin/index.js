$(document).ready(function() {
    $('#addUserF').submit(addUser);
});


//addEMR(userEmail, adderEmail, emrID, type, content)
const addUser = function(event) {

    event.preventDefault();

    const formData = $('#addUserF').serializeArray();
    const name = formData[0].value;
    const email = formData[1].value;
    const type = formData[2].value;

    $.ajax({
        url: 'http://localhost:3001/admin/addUser',
        method: 'POST',
        data: JSON.stringify({
            name: name,
            email: email,
            type: type,
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
                $('#addUserF').trigger("reset");
            }
        },
        error: function(error) {
            swal("Oops", error.toString(), "error");
            console.log(error);
        }
    });
}



// // async getEMR(ctx, emrID, email)
// const getEMR = function(event) {

//     event.preventDefault();

//     const formData = $('#viewEMRF').serializeArray();
//     console.log(formData);
//     const emrID = formData[0].value;
//     const userEmail = formData[1].value;

//     $.ajax({
//         url: 'http://localhost:3002/doctor/getEMR',
//         method: 'POST',
//         data: JSON.stringify({
//             emrID: emrID,
//             userEmail: userEmail
//         }),
//         contentType: 'application/json',
//         success: function(resData) {
//             // alert(resData);
//             $('#emrdata').val(resData);
//             // appendProduct(JSON.parse(data));
//         },
//         error: function(error) {
//             alert(error);
//             console.log(error);
//         }
//     });
// }

