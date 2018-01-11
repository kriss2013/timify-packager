'use strict';

(function () {

	/**
	 * Waiting library to init all components
	 */
	Components.ready(function () {

		/**
		 * Initializing Timify SDK
		 */
		var sdk					= new TimifySDK(accessToken, apiKey),

			/**
			 * Callback method for publishing message to slack
			 */
			publish				= function (appointment) {

				/**
				 * Create new XHR
				 */
				var xhr = new XMLHttpRequest();

				xhr.open('POST', slackAPI + 'chat.postMessage?token=' + slackToken);

				/**
				 * Setting up event listeners of XHR
				 */
				xhr.addEventListener('load', function () {

					var notification = Components.get('operation-status'),
						json;

					try {
						json = JSON.parse(this.responseText);
					}
					catch(error) {
						json = [];
					}

					if (json.ok == true) {

						notification.setTheme('big');
						notification.setType('success');
						notification.setTitle(Locales.slack_sent_successfully_title);
						notification.setMessage(Locales.slack_sent_successfully_message);

					} else {

						notification.setTheme('');
						notification.setType('error');
						notification.setTitle(Locales.unexpected_error);
						notification.setMessage(Locales.please_try_again_later);
					}

					notification.show();
				});
				xhr.addEventListener('error', function () {

					var notification = Components.get('operation-status');
					notification.setTitle(Locales.unexpected_error);
					notification.setType('error');
					notification.setMessage(Locales.please_try_again_later);
					notification.show();
				});

				/**
				 * Setting up correct content type of request
				 */
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

				/**
				 * Sending AJAX request (x-www-form-urlencoded)
				 */
				xhr.send(
					'channel='	+ encodeURIComponent(slackChannel) + '&' +
					'username=' + encodeURIComponent('Бат Жоре') + '&' +
					'text=' + encodeURIComponent(Locales.slack_message.replace('%APPOINTMENT%',
						appointment.title)));
			},

			/**
			 * Load Appointment for selected date
			 */
			loadAppointments	= function () {

				var appointmentsList		= document.querySelector('#appointments-list'),
					json,
					tmp,
					i;

				/**
				 * Clear appointment list
				 */
				appointmentsList.innerHTML	= '';

				/**
				 * Get list of appointments for chosen date
				 */
				sdk.Appointments().get(Components.get('date').value(), Components.get('date').value(), null, null, null,
					null, null, function (json) {

						var json,
							tmp,
							i;

						if (typeof json.status && json.status == 1) {

							if (json.data.length > 0) {
								for (i in json.data) {
									if (json.data.hasOwnProperty(i)) {

										/**
										 * Create new LIST component
										 */
										tmp				= document.createElement('timify:list');
										tmp.setAttribute('uid', 'appointment-' + json.data[i].id);
										tmp.setAttribute('button-label', Locales.send);
										tmp.setAttribute('button-active', true);
										tmp.setAttribute('type', 'button');
										tmp.innerHTML	=
											'<list-title>' + json.data[i].title + '</list-title>' +
											'<details>' +
												'<detail icon="calendar">' +
													moment(json.data[i].date).format('DD') + '. ' +
													Locales.months[moment(json.data[i].date).format('M')] + ' ' +
													moment(json.data[i].date).format('YYYY') +
												'</detail>' +
												'<detail icon="clock-o">' + moment(json.data[i].date).format('HH:mm') + '</detail>' +
											'</details>';

										/**
										 * Append to DOM element
										 */
										appointmentsList.appendChild(tmp);

										/**
										 * Init current list component
										 */
										Components.init(tmp);

										/**
										 * Setting up click handler
										 */
										Components.get('appointment-' + json.data[i].id).click(function () {

											/**
											 * Hide notification
											 */
											Components.get('operation-status').hide();

											/**
											 * Trying to publish message to slack
											 */
											publish(json.data[this]);

										}.bind(i));
									}
								}
							} else {

								/**
								 * Creating new BOX component
								 */
								tmp = document.createElement('timify:box');
								tmp.setAttribute('uid', 'no-appointments-list-box');
								tmp.setAttribute('align', 'center');
								tmp.innerHTML = Locales.no_appointments_found;

								/**
								 * Append to DOM element
								 */
								appointmentsList.appendChild(tmp);

								/**
								 * Init current box component
								 */
								Components.init(tmp);
							}
						}
					});
			},

			/**
			 * Slack variables
			 */
			slackAPI			= 'https://slack.com/api/',
			slackToken			= 'xoxp-190452680183-189678804756-296079268144-659b7813c7cbade8136ffb2732b7cd82',
			slackChannel		= 'general';

		/**
		 * Hide notifications
		 */
		Components.get('operation-status').hide();
		Components.get('operation-settings-status').hide();

		/**
		 * Setting up labels for tab component
		 */
		Components.get('slack-tabs').setTabTitle('appointments', Locales.appointments);

		/**
		 * Init button component
		 */
		Components.get('load').setTitle(Locales.load);
		Components.get('load').click(loadAppointments);

		/**
		 * Setting up label of date picker
		 */
		Components.get('date').setLabel(Locales.date);

		/**
		 * Setting up UNINSTALL button
		 */
		Components.get('uninstall-app').setTitle(Locales.uninstall_btn);
		Components.get('uninstall-app').click(function () {
			document.querySelector('.app-uninstall-confirm').style.display = 'block';
		});

		document.querySelector('.app-uninstall-confirm-message').innerHTML	= Locales.uninstall_confirm;

		document.querySelector('#app-uninstall-btn-confirm').innerHTML		= Locales.confirm;
		document.querySelector('#app-uninstall-btn-confirm').addEventListener('click', function () {

			if (document.querySelector('input#uninstall-confirm').value == 'UNINSTALL') {
				sdk.Applications().uninstall(appId, function (json) {

					if (typeof json !== 'undefined' && typeof json.status !== 'undefined') {

						var notification = Components.get('operation-settings-status');

						if (json.status == 1) {

							if (typeof window.parent !== 'undefined' &&
								typeof window.parent.postMessage !== 'undefined') {

								window.parent.postMessage('timify_app_uninstall:' + appId, "*")
							}

							document.location.reload();
						} else {

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

		/**
		 * Setting up dividers
		 */
		Components.get('divider-uninstall').setTitle(Locales.divider_uninstall);

		document.querySelector('span[rel="box-text"]').innerHTML	= Locales.uninstall_message;
	});

}());
