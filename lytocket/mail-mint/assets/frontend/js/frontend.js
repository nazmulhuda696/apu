jQuery(document).ready(function ($) {
    /**
     * Shortcode form submission ajax
     */

    $(".mrm-form-wrapper-inner form").on("submit",function (e){
        e.preventDefault();
        $(this).find(".response").html("");
        $(this).find(".mrm-submit-button").addClass("show-loader");
        $(this).find(".mrm-submit-button").attr('disabled','disabled');
        let that = this;
        var data = new FormData();
        data.append( "post_data", $(that).serialize() );
        data.append( "wp_nonce", window.MRM_Frontend_Vars.nonce ); // This nonce is created in the following file: /app/Internal/Frontend/FrontendAssets.php
        data.append( "action", "mrm_submit_form");
        fetch(window.MRM_Frontend_Vars.rest_api_url+"mint-mail/v1/mint-form-submit",
            {
                method: "POST",
                headers : {
                    'Access-Control-Allow-Origin' : '*',
                    'X-WP-Nonce' : window.MRM_Frontend_Vars.nonce // This nonce is created in the following file: /app/Internal/Frontend/FrontendAssets.php
                },
                body: data
            })
            .then(function(res){ return res.json(); })
            .then(function(response){
                $(that).find(".mrm-submit-button").removeClass("show-loader");
                $(that).find(".mrm-submit-button").removeAttr('disabled');
                if (response.status === "success") {
                    $(".response").addClass("mintmrm-success");
                    $(that).find(".mrm-submit-button").removeClass("show-loader");
                    if (response.confirmation_type === "same_page") {
                        if (response.after_form_submission === "hide_form") {
                            $(".mrm-form-wrapper form").hide();
                            $(".mrm-form-wrapper").hide();
                        } else if (
                            response.after_form_submission === "reset_form"
                        ) {
                            $("#mrm-form")[0].reset();
                        }
                    }
                    if (response.confirmation_type === "to_a_page") {
                        if (response.redirect_page) {
                            setTimeout(function () {
                                window.location.href = response.redirect_page;
                            }, 2000);
                        } else {
                            setTimeout(function () {
                                $(that).find(".response").html(
                                    "Redirect URL not found"
                                );
                            }, 2000);
                        }
                    }
                    if (response.confirmation_type === "to_a_custom_url") {
                        if (response.custom_url !== "") {
                            setTimeout(function () {
                                window.location.href = response.custom_url;
                            }, 1000);
                        }
                    }
                    $(that).parent().find(".response").html(response.message);
                    $(that).find(".response").html(response.message);
                } else if (response.status == "failed") {
                    $(that).find(".response").addClass("mintmrm-error");
                    $(that).find(".response").html(response.message);
                    $(that).find(".mrm-submit-button").removeAttr('disabled');
                }

            })
    })


    $(".mrm-preferance-form-wrapper form").on("submit", function (e) {
        e.preventDefault();
        jQuery(".response").html("");
        $(".mrm-pref-submit-button").addClass("show-loader");
        var data = new FormData();
        var postData = jQuery("#mrm-preference-form").serialize();
        data.append( "post_data", postData );
        data.append( "wp_nonce", window.MRM_Frontend_Vars.nonce ); // This nonce is created in the following file: /app/Internal/Frontend/FrontendAssets.php
        data.append( "action", "mrm_preference_update_by_user");
        fetch(window.MRM_Frontend_Vars.rest_api_url+"mint-mail/v1/mint-preference-submit",
            {
                method: "POST",
                headers : {
                    'Access-Control-Allow-Origin' : '*',
                    'X-WP-Nonce' : window.MRM_Frontend_Vars.nonce // This nonce is created in the following file: /app/Internal/Frontend/FrontendAssets.php
                },
                body: data
            })
            .then(function(res){ return res.json(); })
            .then(function(response){
                if (response.status == "success") {
                    $(".mrm-pref-submit-button").removeClass("show-loader");
                    $("#mrm-preference-form").hide();
                    $(".response").addClass("mintmrm-success");
                    $(".response").html(response.message);
                } else if (response.status == "failed") {
                    jQuery(".response").addClass("mintmrm-error");
                    jQuery(".response").html(response.message);
                    $(".mrm-pref-submit-button").removeClass("show-loader");
                }
            })
    });

    /**
     * Set cokokie
     * @param name
     * @param value
     * @param daysToLive
     */
    function setCookie(cName, cValue, expDays) {
        let date = new Date();
        date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
        const expires = "expires=" + date.toUTCString();

        var value = { show: cValue, expire: date.getTime() };

        document.cookie =
            cName + "=" + JSON.stringify(value) + "; " + expires + "; path=/";
    }
    /**
     * Form Close button Function
     */


    $(".mrm-form-close").on("click", function () {
        $(this).parent().parent().hide();
        var form_id = $(this).attr('form-id')
        let that = this;
        var data = new FormData();
        data.append( "form_id", form_id );
        data.append( "action", "set_mint_mail_cookie_for_form");
        data.append( "wp_nonce", window.MRM_Frontend_Vars.nonce ); // This nonce is created in the following file: /app/Internal/Frontend/FrontendAssets.php

        fetch(window.MRM_Frontend_Vars.rest_api_url+"mint-mail/v1/mint-form-cookie-submit",
            {
                method: "POST",
                headers : {
                    'Access-Control-Allow-Origin' : '*',
                    'X-WP-Nonce' : window.MRM_Frontend_Vars.nonce // This nonce is created in the following file: /app/Internal/Frontend/FrontendAssets.php
                },
                body: data
            })
            .then(function(res){ return res.json(); })
            .then(function(response){
                if( "success" === response.status){
                    $(that).parent().parent().hide();
                }else{
                    $(that).parent().parent().hide();
                }
            })
    });

    if ($("#mint-google-recaptcha").length > 0) {
        var recaptch_mint = $("#mint-google-recaptcha");
        if(window.MRM_Frontend_Vars.recaptcha_settings.enable &&  window.MRM_Frontend_Vars.recaptcha_settings.api_version === "v2_visible"){
            recaptch_mint.append(`<script src="https://www.google.com/recaptcha/api.js" async defer></script>`)
        }
        if(window.MRM_Frontend_Vars.recaptcha_settings.enable &&  window.MRM_Frontend_Vars.recaptcha_settings.api_version === "v2_visible"){
            recaptch_mint.append(`<div class="g-recaptcha" data-sitekey="`+window.MRM_Frontend_Vars.recaptcha_settings.v2_visible.site_key+`"></div>`)

            document.addEventListener("DOMContentLoaded", function() {
                var site_key = window.MRM_Frontend_Vars.recaptcha_settings.v3_invisible.site_key;
                grecaptcha.ready(function() {
                    grecaptcha.execute(site_key, { action: "homepage" }).then(function(token) {
                        document.getElementById("g-recaptcha-response").value = token;
                    });
                });
            });
        }
    }

    $(".mint-form-button").on('click',function (){
         $(this).parent().parent().find('#mrm-popup').css("display","flex");
    })

});
