$(document).ready(function() {
    $('#grantViewB').click(grantViewAccess);
    $('#revokeViewB').click(revokeViewAccess);
    $('#grantAddB').click(grantAddAccess);
    $('#revokeAddB').click(revokeAddAccess);
    $('#viewEMRF').submit(getEMR);
});

const grantViewAccess = function(event) {

    event.preventDefault();

    const formData = $('#viewAccessF').serializeArray();
    const userEmail = formData[0].value;
    const viewerEmail = formData[1].value;
    const emrID = formData[2].value;
    $.ajax({
        url: 'http://localhost:3000/patient/grantViewAccess',
        method: 'POST',
        data: JSON.stringify({
            userEmail: userEmail,
            viewerEmail: viewerEmail,
            emrID: emrID
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
                $('#viewAccessF').trigger("reset");
            }
        },
        error: function(error) {
            swal("Oops", error.toString(), "error");
            console.log(error)
        }
    });
    // $.ajax({
    //     url: 'http://localhost:3000/unsold',
    //     method: 'GET',
    //     accepts: "application/json",
    //     success: function(data) {
    //         populateUnsoldProducts(data);
    //     },
    //     error: function(error) {
    //         alert(JSON.stringify(error));
    //     }
    // });
}

const revokeViewAccess = function(event) {

    event.preventDefault();

    const formData = $('#viewAccessF').serializeArray();
    const userEmail = formData[0].value;
    const viewerEmail = formData[1].value;
    const emrID = formData[2].value;
    console.log(formData);
    $.ajax({
        url: 'http://localhost:3000/patient/revokeViewAccess',
        method: 'POST',
        data: JSON.stringify({
            userEmail: userEmail,
            viewerEmail: viewerEmail,
            emrID: emrID
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
                $('#viewAccessF').trigger("reset");
            }
        },
        error: function(error) {
            swal("Oops", error.toString(), "error");
            console.log(error)
        }
    });
}


const grantAddAccess = function(event) {

    event.preventDefault();

    const formData = $('#addAccessF').serializeArray();
    const userEmail = formData[0].value;
    const adderEmail = formData[1].value;
    $.ajax({
        url: 'http://localhost:3000/patient/grantAddAccess',
        method: 'POST',
        data: JSON.stringify({
            userEmail: userEmail,
            adderEmail: adderEmail
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
                $('#addAccessF').trigger("reset");
            }
        },
        error: function(error) {
            swal("Oops", error.toString(), "error");
            console.log(error)
        }
    });
}

const revokeAddAccess = function(event) {

    event.preventDefault();

    const formData = $('#addAccessF').serializeArray();
    const userEmail = formData[0].value;
    const adderEmail = formData[1].value;
    console.log(formData);
    $.ajax({
        url: 'http://localhost:3000/patient/revokeAddAccess',
        method: 'POST',
        data: JSON.stringify({
            userEmail: userEmail,
            adderEmail: adderEmail
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
                $('#addAccessF').trigger("reset");
            }
            
        },
        error: function(error) {
            swal("Oops", error.toString(), "error");
            console.log(error)
        }
    });
}

const getEMR = function(event) {

    event.preventDefault();

    const formData = $('#viewEMRF').serializeArray();
    console.log(formData);
    const userEmail = formData[0].value;
    const emrID = formData[1].value;

    $.ajax({
        url: 'http://localhost:3000/patient/getEMR',
        method: 'POST',
        data: JSON.stringify({
            userEmail: userEmail,
            emrID: emrID
        }),
        contentType: 'application/json',
        success: function(resData) {
            // alert(resData);
            if ((resData.toString().indexOf("Error:") != -1)) {
                //alert(resData);
                swal("Oops", resData, "error");
                $('#emrdata').css('display', 'none');
            } else {
                $('#emrdata').val(resData);
                // $('#emrdata').display("inline");
                $('#emrdata').css('display', 'inline');
            }
            
            // appendProduct(JSON.parse(data));
        },
        error: function(error) {
            //alert(error);
            swal("Oops", error.toString(), "error");
            console.log(error);
        }
    });
}
