'use strict';

(function () {
	Components.ready(function () {
		var sdk = new TimifySDK(accessToken, apiKey);
	});

	//We need to set name of the main tab. We get it from locale file.
	Components.get('contacts-tabs').setTabTitle('contact-form', Locales.contact_form);

	//Hide notifications boxes
	Components.get('contact-form-notification').hide();
	Components.get('operation-settings-status').hide();

	/**
	 * Here we will add the main functionality
	 */
	document.querySelector('[rel="contact-form-message"]').innerHTML	= Locales.contact_form_message;

	Components.get('name-field').setLabel(Locales.name_field);
	Components.get('email-field').setLabel(Locales.email_field);
	Components.get('phone-field').setLabel(Locales.phone_field);
	Components.get('message-field').setLabel(Locales.message_field);
	Components.get('submit-btn').setTitle(Locales.submit_form_button);

	//Click to submit contact form
	Components.get('submit-btn').click(function () {
		var validData	= true,
			formData	= {
				name		: Components.get('name-field').value(),
				email		: Components.get('email-field').value(),
				phone		: Components.get('phone-field').value(),
				message		: Components.get('message-field').value()			
			},
			notification = Components.get('contact-form-notification');

		//First we need to clear all error messages
		Components.get('name-field').error('');
		Components.get('email-field').error('');
		Components.get('phone-field').error('');
		Components.get('message-field').error('');
		notification.hide();

		if (formData.name == '') {
			Components.get('name-field').error(Locales.error_field_required);
			validData	= false;
		}	
		if (formData.email == '') {
			Components.get('email-field').error(Locales.error_field_required);
			validData	= false;
		}
		if (formData.phone == '') {
			Components.get('phone-field').error(Locales.error_field_required);
			validData	= false;
		}
		if (formData.message == '') {
			Components.get('message-field').error(Locales.error_field_required);
			validData	= false;
		}	

		//If there have some error we need to show error message
		if (!validData) {

			notification.setTitle(Locales.validation_error);
			notification.setType('error');
			notification.setMessage(Locales.contact_form_error);
			notification.show();

		}
		else {

			//Here you can add your source code to send all form data to some API endpoint.


			

			//Also we need to show success message
			notification.setTitle(Locales.complete_title);
			notification.setType('success');
			notification.setMessage(Locales.complete_message);
			notification.show();

			//And clear fields data
			Components.get('name-field').value('');
			Components.get('email-field').value('');
			Components.get('phone-field').value('');
			Components.get('message-field').value('');
		}

	});

	/**
	 * So we will need to set up UNINSTALL button in settings tab
	 */
	Components.get('uninstall-app').setTitle(Locales.uninstall_btn);
	Components.get('uninstall-app').click(function () {
		document.querySelector('.app-uninstall-confirm').style.display = 'block';
	});

	Components.get('divider-uninstall').setTitle(Locales.divider_uninstall);
	document.querySelector('.app-uninstall-confirm-message').innerHTML	= Locales.uninstall_confirm;
	document.querySelector('#uninstall-message').innerHTML	= Locales.uninstall_message;

	document.querySelector('#app-uninstall-btn-confirm').innerHTML		= Locales.confirm;
	document.querySelector('#app-uninstall-btn-confirm').addEventListener('click', function () {

		if (document.querySelector('input#uninstall-confirm').value == 'UNINSTALL') {
			
			/**
			 * If the user type UNINSTALL in input field we need to execute a query to the API. We can do this via the SDK with
			 * uninstall method.
			 */
			sdk.Applications().uninstall(appId, function (json) {

				if (typeof json !== 'undefined' && typeof json.status !== 'undefined') {

					var notification = Components.get('operation-settings-status');

					if (json.status == 1) {

						/**
						 * If the application was removed successfully we need to send message to main container of the web application.
						 * This is required because we need to make some additional updates on the web application.
						 */
						if (typeof window.parent !== 'undefined' &&
							typeof window.parent.postMessage !== 'undefined') {

							window.parent.postMessage('timify_app_uninstall:' + appId, "*");
						}

						document.location.reload();
					} else {

						/**
						 * If the API return an error we need to show some message to the user.
						 */
						notification.setTitle(Locales.unexpected_error);
						notification.setType('error');
						notification.setMessage(json.message);
						notification.show();
					}
				}
			});
		}
	});

	document.querySelector('#app-uninstall-btn-cancel').innerHTML		= Locales.cancel;
	document.querySelector('#app-uninstall-btn-cancel').addEventListener('click', function () {
		document.querySelector('.app-uninstall-confirm').style.display = 'none';
	});
	

}());
