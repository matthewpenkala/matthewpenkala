var teleInput = $("#Phone, input[type='tel'], input[data-name*=Phone]");
$(document).ready(function () {
    var letterToNumberMap = {
        a: '2',
        b: '2',
        c: '2',
        d: '3',
        e: '3',
        f: '3',
        g: '4',
        h: '4',
        i: '4',
        j: '5',
        k: '5',
        l: '5',
        m: '6',
        n: '6',
        o: '6',
        p: '7',
        q: '7',
        r: '7',
        s: '7',
        t: '8',
        u: '8',
        v: '8',
        w: '9',
        x: '9',
        y: '9',
        z: '9'
    };
    function convertLettersToNumbers(input) {
        return input.replace(/[a-z]/gi, function (matched) {
            return letterToNumberMap[matched.toLowerCase()];
        });
    }
    function cleanPhoneNumber(input) {
        // Remove all non-alphanumeric characters
        var cleanedNumber = input.replace(/\W/g, '');
        // Format as (XXX) XXX-XXXX
        return '(' + cleanedNumber.substr(0, 3) + ') ' + cleanedNumber.substr(3, 3) + '-' + cleanedNumber.substr(6, 4);
    }
    $(teleInput).on('input', function () {
        var input = convertLettersToNumbers($(this).val().replace(/\D/g, ''));
        // Remove all non-numeric characters
        // Check if the input has more than 10 numbers and the first number isn't '1'
        if (input.length > 10 && input.charAt(0) !== '1') {
            $(this).val(input);    // Set the value to plain, non-formatted text
        } else if (input.length === 10) {
            // Format as (XXX) XXX-XXXX
            var formattedNumber = '(' + input.substr(0, 3) + ') ' + input.substr(3, 3) + '-' + input.substr(6, 4);
            $(this).val(formattedNumber);
        } else if (input.length === 11 && (input.charAt(0) === '1' || input.substr(0, 2) === '01')) {
            // Format as +1 (XXX) XXX-XXXX
            var formattedNumber = '+1 (' + input.substr(1, 3) + ') ' + input.substr(4, 3) + '-' + input.substr(7, 4);
            $(this).val(formattedNumber);
        }
    });
    // Handle keydown event to disallow user input of "+"
    $(teleInput).on('keydown', function (event) {
        if (event.key === '+' && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
        }
    });
    // Handle paste event to restrict pasting with specific patterns
    $(teleInput).on('paste', function (event) {
        var clipboardData = (event.clipboardData || window.clipboardData).getData('text');
        var pattern = /^\+1\s?(\(\d{3}\)|\d{3})([-.\s]?)\d{3}\2\d{4}$/;
        if (!pattern.test(clipboardData)) {
            event.preventDefault();
        } else {
            // Replace alphabetical characters in pasted data
            var convertedData = convertLettersToNumbers(clipboardData);
            $(this).val(convertedData);
        }
    });
    // Form submission
    $('#contact-form').add("form[data-name*='Contact'],[aria-label='Contact Form']").on('submit', function (event) {
        event.preventDefault();
        var phoneNumber = teleInput.val();
        var cleanedNumber = cleanPhoneNumber(phoneNumber);
        teleInput.val(cleanedNumber);
        $(this).submit();
    });
});
var validatePhoneOnKeyUpAttached = false;
function validateForm() {
    //then, we attach the event listened to the field after the submit, if it has not been done so far
    if (!validatePhoneOnKeyUpAttached) {
        $(teleInput).get(0).onkeyup = checkPhone;
        validatePhoneOnKeyUpAttached = true;
    }
    return checkPhone();
}
function matchPhoneNumber(d) {
    for (var $ = [
                /^\+1 \d{3} \d{3} \d{4}$/,
                /^\+1\d{10}$/,
                /^\+1 \d{10}$/,
                /^\+1 \(\d{3}\) \d{3}-\d{4}$/,
                /^\+1 \d{3}-\d{3}-\d{4}$/,
                /^\+1 \(\d{3}\) \d{3} \d{4}$/,
                /^\+1 \d{3}\.\d{3}\.\d{4}$/,
                /^\+1 \(\d{3}\) \d{7}$/,
                /^\+1 \d{3} \d{3}-\d{4}$/,
                /^\+1\d{3} \d{3} \d{4}$/
            ], t = 0; t < $.length; t++)
        if ($[t].test(d))
            return !0;
}
function checkPhone() {
    var phone = teleInput.val();
    var phoneNum = phone.replace(/[^\d]/g, '');
    if (phoneNum.length > 6 && phoneNum.length < 11) {
        $(teleInput).get(0).style.borderColor = '#1fe01f';
        return true;
    } else if (matchPhoneNumber(phone) == true) {
        $(teleInput).get(0).style.borderColor = '#1fe01f';
    } else if (phoneNum.length < 7 || phoneNum.length > 10) {
        if (phoneNum.length <= 0) {
            javascript:
                void 0;
        } else {
            $(teleInput).get(0).style.borderColor = '#e01f1f';
            return false;
        }
    }
}
// Function to handle the events you mentioned
function handleEvents() {
    // On Tab key press
    $(document).on('keydown', function (e) {
        if (e.which === 9) {
            checkPhone(teleInput);
        }
    });
    // On Enter key press
    $(document).on('keydown', function (e) {
        if (e.which === 13) {
            checkPhone(teleInput);
        }
    });
    // On arrow keys press
    $(document).on('keydown', function (e) {
        if ([
                37,
                38,
                39,
                40
            ].includes(e.which)) {
            checkPhone(teleInput);
        }
    });
    // On page up key press
    $(document).on('keydown', function (e) {
        if (e.which === 33) {
            checkPhone(teleInput);
        }
    });
    // On page down key press
    $(document).on('keydown', function (e) {
        if (e.which === 34) {
            checkPhone(teleInput);
        }
    });
    // On delete key press
    $(document).on('keydown', function (e) {
        if (e.which === 46) {
            checkPhone(teleInput);
        }
    });
    // On spacebar press
    $(document).on('keydown', function (e) {
        if (e.which === 32) {
            checkPhone(teleInput);
        }
    });
    // On click anywhere inside the specified form element
    $(document).on('click', "#contact-form, form[data-name*='Contact'], [aria-label='Contact Form']", function () {
        checkPhone(teleInput);
    });
}
handleEvents();
function countWords(str) {
    return str.trim().split(/\s+/).length;
}
var messageInput = $(teleInput).parent('*').siblings().find($('#message,textarea[data-name*=Message]'));
function validateInput() {
    var input = messageInput.val();
    var charCount = input.length;
    var wordCount = countWords(input);
    if (charCount >= 50 && wordCount >= 10) {
        $(messageInput).css('border-color', '#1fe01f');
    } else if (messageInput.length >= 1) {
        $(messageInput).css('border-color', '#e01f1f');
    }
}
$(messageInput).on('input', function () {
    validateInput();
});