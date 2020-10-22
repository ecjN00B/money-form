
(function ($) {
    "use strict";
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    $("#btn-sim").click((e) => {
        e.preventDefault();
        submitForm("Sim");
    });

    $("#btn-nao").click((e) => {
        e.preventDefault();
        submitForm("Não");
    });

    $(document).ready(() => {
        const meses = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"
        ];
        let date = new Date();
        $("#data").html(`${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}`);
	document.getElementById("monica").scrollIntoView();
    });

    function submitForm(option) {
        const name = $('#name').val();
        const mail = $('#email').val();
        if(name === "" || mail === "") {
            alert("Preencha os campos");
            return;
        }
        if(mail.trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            alert("Email invalido");
            return;
        }
        const body = {
            formId: "1",
            answer: {
                name: name,
                email: mail,
                answers: [option],
                date: new Date()
            }
        }
        $.post("/db/form/answer", body)
        .done((response) => {
            console.log(response);
            $("#form").html(`
            <a href="https://digitaly.tech" target="_blank" style="align-self: center;">
                <div class="voto">
                    <h1>Voto computado com sucesso!</h1>
                    <br><br>
                    <image src="./images/digi.png" style="height: 65%; margin-right: -3px;"></image>
                </div>
            </a>
            `)
        })
    }
    

})(jQuery);
