function $_GET(key) {
    var p = window.location.search;
    p = p.match(new RegExp(key + '=([^&=]+)'));
    return p ? p[1] : '';
}


var AjaxForm = {

    initialize: function (afConfig) {
        if (!jQuery().ajaxForm) {
            document.write('<script src="' + afConfig['assetsUrl'] + 'js/lib/jquery.form.min.js"><\/script>');
        }
        if (!jQuery().jGrowl) {
            document.write('<script src="' + afConfig['assetsUrl'] + 'js/lib/jquery.jgrowl.min.js"><\/script>');
        }

        $(document).ready(function () {
            $.jGrowl.defaults.closerTemplate = '<div>[ ' + afConfig['closeMessage'] + ' ]</div>';
        });

        $(document).off('submit', afConfig['formSelector']).on('submit', afConfig['formSelector'], function (e) {
            fbq('track', 'Lead');
            $(this).ajaxSubmit({
                dataType: 'json',
                data: {pageId: afConfig['pageId'], utm_source: $_GET('utm_source'), utm_medium: $_GET('utm_medium'), utm_campaign: $_GET('utm_campaign'), utm_content: $_GET('utm_content'), utm_term: $_GET('utm_term')},
                url: afConfig['actionUrl'],
                beforeSerialize: function (form) {
                    form.find(':submit').each(function () {
                        if (!form.find('input[type="hidden"][name="' + $(this).attr('name') + '"]').length) {
                            $(form).append(
                                $('<input type="hidden">').attr({
                                    name: $(this).attr('name'),
                                    value: $(this).attr('value')
                                })
                            );
                        }
                    })
                },
                beforeSubmit: function (fields, form) {
                    //noinspection JSUnresolvedVariable
                    if (typeof(afValidated) != 'undefined' && afValidated == false) {
                        return false;
                    }
                    form.find('.error').html('');
                    form.find('.error').removeClass('error');
                    form.find('input,textarea,select,button').attr('disabled', true);
                    return true;
                },
                error: function(data ) { console.log(data); },
                success: function (response, status, xhr, form) {
                    form.find('input,textarea,select,button').attr('disabled', false);
                    response.form = form;
                    $(document).trigger('af_complete', response);
                    if (!response.success) {
                        AjaxForm.Message.error(response.message);
                        if (response.data) {
                            var key, value, focused;
                            for (key in response.data) {
                                if (response.data.hasOwnProperty(key)) {
                                    if (!focused) {
                                        form.find('[name="' + key + '"]').focus();
                                        focused = true;
                                    }
                                    value = response.data[key];
                                    form.find('.error_' + key).html(value).addClass('error');
                                    form.find('[name="' + key + '"]').addClass('error');
                                }
                            }
                        }
                    }
                    else {
                        /* send calltouch */
                        try {
                        var fio = form.find('input[name*="fio"]').val();
                        var phone = form.find('input[name*="phone"],input[name*="tel"]').val();
                        var mail = form.find('input[name*="email"]').val();
                        var ct_site_id = '33142';
                        var sub = 'Заявка';
                        var ct_data = {            
                        fio: fio,
                        phoneNumber: phone,
                        email: mail,
                        subject: sub,
                        sessionId: window.call_value
                        };
                        jQuery.ajax({ 
                          url: 'https://api-node12.calltouch.ru/calls-service/RestAPI/requests/'+ct_site_id+'/register/',
                          dataType: 'json', type: 'POST', data: ct_data, async: false
                        });
                        } catch(e) { }
                        /* send calltouch */
                        AjaxForm.Message.success(response.message);
                        form.find('.error').removeClass('error');
                        form[0].reset();
                        //noinspection JSUnresolvedVariable
                        if (typeof(grecaptcha) != 'undefined') {
                            //noinspection JSUnresolvedVariable
                            grecaptcha.reset();
                        }
                    }
                }
            });
            e.preventDefault();
            return false;
        });

        $(document).on('keypress change', '.error', function () {
            var key = $(this).attr('name');
            $(this).removeClass('error');
            $('.error_' + key).html('').removeClass('error');
        });

        $(document).on('reset', afConfig['formSelector'], function () {
            $(this).find('.error').html('');
            AjaxForm.Message.close();
        });
    }

};


//noinspection JSUnusedGlobalSymbols
AjaxForm.Message = {
    success: function (message, sticky) {
        if (message) {
            if (!sticky) {
                sticky = false;
            }
            $.jGrowl(message, {theme: 'af-message-success', sticky: sticky});
        }
    },
    error: function (message, sticky) {
        if (message) {
            if (!sticky) {
                sticky = false;
            }
            $.jGrowl(message, {theme: 'af-message-error', sticky: sticky});
        }
    },
    info: function (message, sticky) {
        if (message) {
            if (!sticky) {
                sticky = false;
            }
            $.jGrowl(message, {theme: 'af-message-info', sticky: sticky});
        }
    },
    close: function () {
        $.jGrowl('close');
    },
};
