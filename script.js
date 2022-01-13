class Validator {

    constructor() {
        this.validations = [
            'data-required',
            'data-min-length',
            'data-max-length',
            'data-email-validate',
            'data-only-letters',
            'data-equal',
            'data-password-validate'
        ]
    }
    
    // Iniciar a validação de todos os campos
    validate(form) {
        //resgata todas as validações
        let currentValidations = document.querySelectorAll('form .error-validation');

        if (currentValidations.length > 0) {
            this.cleanValidations(currentValidations);
        }


        //pegar os inputs
        let inputs = form.getElementsByTagName('input');

        //transforma um HTMLCollection -> array
        let inputsArray = [...inputs];

        //loop nos inputs e validação mediante ao que for encontrado
        inputsArray.forEach(function (input) {
            //loop em todas as validações existentes
            for (let i = 0; this.validations.length > i; i++) {
                //verifica se a validação atual existe no input
                if (input.getAttribute(this.validations[i]) != null) {
                    //limpando a string para virar um método (minlength) abaixo.
                    let method = this.validations[i].replace("data-", "").replace("-", "");

                    //valor do input
                    let value = input.getAttribute(this.validations[i]);

                    //invoca o método
                    this[method](input, value);
                }
            }
        }, this);

    }

    //verifica se um input tem um número mínimo de caracteres
    minlength(input, minValue) {
        let inputLength = input.value.length;

        let errorMessage = `O campo precisa ter pelo menos ${minValue} caracteres`;

        if (inputLength < minValue) {
            this.printMessage(input, errorMessage)
        }
    }
    //verifica se o input passou do limite de caracteres
    maxlength(input, maxValue) {
        let inputLength = input.value.length;

        let errorMessage = `O campo precisa ter menos que ${maxValue} caracteres`;

        if (inputLength > maxValue) {
            this.printMessage(input, errorMessage)
        }
    }
    //valida os e-mails conforme requerido no HTML (data-email-validate)
    emailvalidate(input) {
        // email@email.com -> email@email.com
        let re = /\S+@\S+\.\S+/;

        let email = input.value;

        let errorMessage = `Insira um e-mail no padrão fulado@email.com`;

        if (!re.test(email)) {
            this.printMessage(input, errorMessage);
        }
    }
    //Valida o requerimento feito no HTML (data-only-letters)
    onlyletters(input) {
        let re = /^[A-Za-z]+$/;

        let inputValue = input.value;

        let errorMessage = `Este campo não aceita números nem caracteres espaciais`;
        if (!re.test(inputValue)) {
            this.printMessage(input, errorMessage);
        }
    }

    //verifica se dois campos são iguais.

    equal(input, inputName) {
        let inputToCompare = document.getElementsByName(inputName)[0];
        let errorMessage = `Este campo precisa estar igual ao ${inputName}`;
        if (input.value != inputToCompare.value) {
            this.printMessage(input, errorMessage);
        }
    }
    // Valida o campo de senha
    passwordvalidate(input) {
        let charArr = input.value.split("");
        let uppercases = 0;
        let numbers = 0;

        for (let i = 0; charArr.length > i; i++) {
            if (charArr[i] === charArr[i].toUpperCase() && isNaN(parseInt(charArr[i]))) {
                uppercases++
            } else if (!isNaN(parseInt(charArr[i]))) {
                numbers++;
            }
        }

        if (uppercases === 0 || numbers === 0) {
            let errorMessage = `A senha precisa de um caractere maiúsculo e um número`;
            this.printMessage(input, errorMessage)
        }
    }

    //metodo para imprimir mensagem de erro na tela
    printMessage(input, msg) {

        let errorsQty = input.parentNode.querySelector('.error-validation');

        if (errorsQty === null) {
            let template = document.querySelector('.error-validation').cloneNode(true);

            template.textContent = msg;

            let inputParent = input.parentNode;

            template.classList.remove('template');

            inputParent.appendChild(template);
        }
    }

    //verifica se o input foi preenchido nos modo determinado no HTML
    required(input) {
        let inputValue = input.value;
        if (input.value === '') {
            let errorMessage = `Este campo é obrigatório`
            this.printMessage(input, errorMessage);
        }
    }


    //limpa as valiações da tela
    cleanValidations(validations) {
        validations.forEach(el => el.remove());
    }

}

let form = document.getElementById("register-form");
let submit = document.getElementById("btn-submit");

let validator = new Validator();

//evento que dispara as validações
submit.addEventListener('click', function (e) {
    e.preventDefault(); // função que impede o formulário de enviar informações para o servidor, já que aqui não teremos validação pelo back-end
    validator.validate(form);
})