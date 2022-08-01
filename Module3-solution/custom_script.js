(function (jQuery) {
  //Using this custom ajax command to remove bound dropdowns
  jQuery.fn.chosenDestroy = function(selector){

    if(typeof jQuery(selector) != undefined && jQuery(selector).length > 0){
      var chosenID = jQuery(selector).attr('id');
      var chosenDiv = chosenID.replace('-','_').replace('--','__');

      if(jQuery('#' + chosenDiv + '_chosen').length > 0){
        //This DIV exists don't do this again otherwise it will re-enable the chosen library for some reason
        jQuery(selector).chosen('destroy');
        jQuery(selector).removeClass('chosen-select');
      }
    }else{
      console.log("Error: Invalid Selector, Please refer to GRLContent documentation for proper usage");
    }
  };
}) (jQuery);

jQuery( document ).ready(function() {

  jQuery('.fileUpload').each(function(){
    var elementID = jQuery(this).attr("id");
    jQuery("label[for='"+elementID+"']").click(function(e){
      if (e.target.tagName !== 'A') {
        e.preventDefault();
      }
    });
  });


  if (jQuery('#commerce-checkout-form-review #edit-continue').length){
    jQuery('#commerce-checkout-form-review #edit-continue').parent().append('<div style="clear:both; width:100%; height:1px;"></div><p style="text-align: right;">By proceeding with the purchase, you agree that all sales are final. Immediate access is non-refundable.</p>');
  }


  //jQuery("#content_area_1 section.right-hld div").find(".scroll_auto").addClass("component_assessment");

  jQuery("#content_area_1").after("<div id='content_extra_1'></div><div id='content_extra_2'></div><div id='content_extra_3'></div>");

  jQuery(".form-item-is-trial-access .option").attr('for', '');

  prevent_multi_clicks();

  //add aria description to links that open new windows
  jQuery('a[target="_blank"]').each(function(){
    //check if link already has aria attribute
    var ariaCheck = jQuery(this).attr('aria-describedby');

    if(typeof ariaCheck === 'undefined' || ariaCheck === false){
      jQuery(this).attr('aria-describedby', 'new-window');
    }
  });

  //make Drupal messages into alerts that are read out by screen readers
  jQuery('.messages.error').attr('aria-live', 'assertive');
  jQuery('.messages.error').attr('role', 'alert');

  formbite_sizeing();

  // rewrite all site titles to use current domain (for white labeling)(also update page--front)
  var titleRewriter = function (a) {
    currentTitle = jQuery(document).prop('title');
    newTitle = currentTitle.indexOf('GRLContent') + 'GRLContent'.length;
    newTitle = currentTitle.substring(0, currentTitle.indexOf('GRLContent')) + a + currentTitle.substring(newTitle, currentTitle.length);
    document.title = newTitle;
  };
  var faviconRewriter = function (a) {
    imageURL = jQuery('link[rel="shortcut icon"]').attr("href");
    newimageURL = imageURL.lastIndexOf('/');
    newimageURL = newimageURL == -1 ? imageURL.length : newimageURL + 1;
    imageURL = imageURL.substring(0, newimageURL);
    imageURL = imageURL + a;
    jQuery('link[rel="shortcut icon"]').attr("href", imageURL);
  };
  var internalLogoRewriter = function (a) {
    imageURL = jQuery('.section #logo img').attr("src");
    if(imageURL){
      newimageURL = imageURL.lastIndexOf('/');
      newimageURL = newimageURL == -1 ? imageURL.length : newimageURL + 1;
      imageURL = imageURL.substring(0, newimageURL);
      imageURL = imageURL + a;
      jQuery('.section #logo img').attr("src", imageURL);
    }
  };
  var contentFindReplace = function (findText,replaceText) {
    div = window.location.pathname.split("/").pop();
    if (div == 'showPrivacyPolicy'){
      div = '#privacy-statement';
    } else if (div == 'termsOfUsePage'){
      div = '#terms-of-use-page';
    }
    if (jQuery(div).length) {
      new_text = jQuery(div).html().replace(new RegExp(findText, "gi"), replaceText);
      jQuery(div).html(new_text);
    }
  };

  if (document.domain.split(".")[1] == 'grlcontent'){
    titleRewriter('GRLContent');
    internalLogoRewriter('grt_logo.png');
    faviconRewriter('favicon.ico');
  } else if (document.domain.split(".")[1] == 'khpcontent'){
    titleRewriter('KHPContent');
    internalLogoRewriter('khpcontent-white.png');
    faviconRewriter('favicon_khp.ico');
    contentFindReplace('GRLcontent', 'KHPcontent');
    contentFindReplace('GRL', 'KHP');
    contentFindReplace('GREAT RIVER LEARNING', 'KENDALL HUNT PUBLISHING');
    contentFindReplace('PUBLISHING publishing', 'PUBLISHING');
  } else if (document.domain.split(".")[1] == 'rclbcontent') {
    titleRewriter('RCLBContent');
    internalLogoRewriter('rclb_logo_content_interior.png');
    faviconRewriter('favicon_rclb.ico');
    contentFindReplace('GRLcontent', 'RCLBcontent');
    contentFindReplace('GRL', 'RCLB');
    contentFindReplace('GREAT RIVER LEARNING', 'RCL Benziger');
  } else if (document.domain.split(".")[1] == 'pescontent') {
    titleRewriter('PESContent');
    internalLogoRewriter('paradigm_logo_content_interior.png');
    faviconRewriter('favicon_pes.ico');
    contentFindReplace('GRLcontent', 'PEScontent');
    contentFindReplace('GRL', 'PES');
    contentFindReplace('GREAT RIVER LEARNING', 'Paradigm Education Solutions');
  }

});


function strstr(haystack, needle, bool) {
  var pos = 0;

  haystack += '';
  pos = haystack.toLowerCase().indexOf((needle + '').toLowerCase());
  if (pos == -1) {
    return false;
  } else {
    if (bool) {
      return haystack.substr(0, pos);
    } else {
      return haystack.slice(pos);
    }
  }
}

function isOverflown(element) {
  if (jQuery(element).html() != null) {
    return element[0].scrollWidth > element.innerWidth();
  } else {
    return false;
  }
}

function addTitleOnOverflow(){
  jQuery('.jqx-grid-cell').each(function (index) {
    if ((isOverflown(jQuery(this).find('div'))) && (jQuery(this).prop('title') == '')) {
      jQuery(this).prop('title', jQuery(this).text());
    }
  });
}

function jqxGridWCAGcorrections() {
  jQuery('.jqx-grid-column-header').parent().attr("role", "row");
  jQuery('.jqx-dropdownlist-state-normal').removeAttr("aria-readonly");
  jQuery('.jqx-dropdownlist-state-normal').attr("aria-expanded", "false");

  jQuery('.jqx-grid-pager .jqx-dropdownlist-state-normal').attr("aria-labelledby", "jqx-dropdownlist-label-show-rows-grid-footer");
  jQuery('.jqx-grid-pager .jqx-dropdownlist-state-normal').next().attr("id", "jqx-dropdownlist-label-show-rows-grid-footer");

  jQuery('.jqx-grid-pager .jqx-grid-pager-input').attr("aria-labelledby", "jqx-input-label-go-to-grid-footer");
  jQuery('.jqx-grid-pager .jqx-grid-pager-input').parent().next().attr("id", "jqx-input-label-go-to-grid-footer");

  if (jQuery('#dropdownlistContentgridpagerlistmanage_component_jqxgrid').length > 0) {
    jQuery('#dropdownlistContentgridpagerlistmanage_component_jqxgrid').attr("aria-live", "assertive");
  }

  jQuery(".jqx-clear.jqx-overflow-hidden.jqx-position-absolute.jqx-reset.jqx-reset-classic.jqx-disableselect").parent().attr('tabindex', '0');
  jQuery(".jqx-clear.jqx-overflow-hidden.jqx-position-absolute.jqx-reset.jqx-reset-classic.jqx-disableselect").attr('tabindex', '0');
  jQuery(".jqx-grid.jqx-grid-classic.jqx-reset-classic.jqx-disableselect").parent().attr('tabindex', '0');
  jQuery(".jqx-widget.jqx-widget-classic.jqx-dropdownlist-state-normal.jqx-dropdownlist-state-normal-classic").attr('tabindex', '0');
  jQuery(".jqx-input.jqx-input-classic.jqx-widget-content.jqx-widget-content-classic.jqx-grid-pager-input.jqx-grid-pager-input-classic").attr('tabindex', '0');

  jQuery("div[type='button']").attr('tabindex', '0');
  jQuery(".jqx-grid-cell[tabindex='16']").attr('tabindex', '0');
  jQuery(".jqx-clear[tabindex='2']").attr('tabindex', '0');
  jQuery(".jqx-widget[tabindex='18']").attr('tabindex', '0');
  jQuery(".jqx-input[tabindex='17']").attr('tabindex', '0');

  setTimeout(
    function () {
      jQuery(".jqx-clear.jqx-overflow-hidden.jqx-position-absolute.jqx-reset.jqx-reset-classic.jqx-disableselect").parent().attr('tabindex', '0');
      jQuery(".jqx-clear.jqx-overflow-hidden.jqx-position-absolute.jqx-reset.jqx-reset-classic.jqx-disableselect").attr('tabindex', '0');
      jQuery(".jqx-grid.jqx-grid-classic.jqx-reset-classic.jqx-disableselect").parent().attr('tabindex', '0');
      jQuery(".jqx-widget.jqx-widget-classic.jqx-dropdownlist-state-normal.jqx-dropdownlist-state-normal-classic").attr('tabindex', '0');
      jQuery(".jqx-input.jqx-input-classic.jqx-widget-content.jqx-widget-content-classic.jqx-grid-pager-input.jqx-grid-pager-input-classic").attr('tabindex', '0');

      jQuery("div[type='button']").attr('tabindex', '0');
      jQuery(".jqx-grid-cell[tabindex='16']").attr('tabindex', '0');
      jQuery(".jqx-clear[tabindex='2']").attr('tabindex', '0');
      jQuery(".jqx-widget[tabindex='18']").attr('tabindex', '0');
      jQuery(".jqx-input[tabindex='17']").attr('tabindex', '0');
    }, 5
  );


  // ui-dialog search forms on grids
  jQuery(".ui-dialog label").each(function () {
    inputID = jQuery(this).next().attr("id");
    jQuery(this).attr("for", inputID);
  });

  // user_grid_div empty link tags in grid cells
  jQuery("#jqxWidget a").each(function () {
    if (jQuery(this).html() == "") {
      linkContent = '<span>' + jQuery(this).attr('title') + '</span>';
      jQuery(this).text('');
      jQuery(this).append(linkContent);
    } else if (jQuery(this).children('.ui-icon').html() == "") {
      linkContent = '<span>' + jQuery(this).children('.ui-icon').attr('title') + '</span>';
      jQuery(this).children('.ui-icon').text('');
      jQuery(this).children('.ui-icon').append(linkContent);
    }
  });

  // jqx-grid-cell
  jQuery("#jqxWidget .jqx-grid-cell").each(function () {
    jQuery(this).removeAttr('title');
  });

  // column header icon title fix
  jQuery(".jqx-grid-column-header .ui-icon").each(function () {
    linkContent = '<span>' + jQuery(this).attr('title') + '</span>';
    linkContent.concat(linkContent, jQuery(this).html());
    jQuery(this).html(linkContent);
  });

  //remove third sort state
  jQuery(".sortdesc").parent().parent().parent().click(function () {
    var domObjectClick = this;
    if (jQuery(this).find(".sortdesc:visible").length != 0) {
      setTimeout(
        function () {
          jQuery(domObjectClick).find(".sortdesc").click();
        }, 5);
    }
  });

  //add aria description to links that open new windows
  jQuery('a[target="_blank"]').each(function(){
    //check if link already has aria attribute
    var ariaCheck = jQuery(this).attr('aria-describedby');

    if(typeof ariaCheck === 'undefined' || ariaCheck === false){
      jQuery(this).attr('aria-describedby', 'new-window');
    }
  });


}

/* custom date comparision */
jQuery(document).ready(function () {
  jQuery('.report_listing').each(function () {
    table = jQuery(this);
    tableRow = table.find('tr');
    table.find('td').not('td td').each(function () {
      tdIndex = jQuery(this).index();
      thText = '';
      if (jQuery(tableRow).find('th').eq(tdIndex).attr('data-label')) {
        thText = jQuery(tableRow).find('th').eq(tdIndex).data('label');
      } else {
        thText = jQuery(tableRow).find('th').eq(tdIndex).text();
      }
      jQuery(this).attr('data-label', thText + ':');
    });
  });

  jQuery('.studentTable').each(function () {
    table = jQuery(this);
    tableRow = table.find('tr');
    table.find('td').not('td td').each(function () {
      tdIndex = jQuery(this).index();
      thText = '';
      if (jQuery(tableRow).find('th').eq(tdIndex).attr('data-label')) {
        thText = jQuery(tableRow).find('th').eq(tdIndex).data('label');
      } else {
        thText = jQuery(tableRow).find('th').eq(tdIndex).text();
      }
      jQuery(this).attr('data-label', thText);
    });
  });

  if ((jQuery('#enter-access-code').length > 0) && (jQuery('#block-block-2:contains("Welcome")').length)) {
    jQuery('#edit-enroll-title h2').text('I already have an access code for my new publication');
    jQuery('#edit-enroll-title-user h2').text('I need to purchase an access code for my new publication');
  }

  var gridButtonsUse = jQuery('.gridwrapper').siblings('.grid-buttons').length;
  if (gridButtonsUse > 0){
    jQuery(".grid-buttons").last().detach().prependTo(".grid-buttons").unwrap();
  }
});

function isFromBiggerThanTo(dtmfrom, dtmto) {
  return new Date(dtmfrom).getTime() >= new Date(dtmto).getTime();
}

function date_validate_add_publication() {
  var from_date = jQuery("input[name='live_acces_begin']").val();
  var to_date = jQuery("input[name='live_acces_end']").val();
  if (from_date != '' && to_date != '') {
    var compare = isFromBiggerThanTo(from_date, to_date);
    if (compare != false) {
      if (jQuery('#customvalidateMsg').length > 0) {
        jQuery('#customvalidateMsg').remove();
      }

      jQuery(".form-item-live-acces-begin").parent().before('<div class="ctrlHolder" id="customvalidateMsg" style="background: url(https://' + window.location.host + '/sites/all/themes/grtepwebcom/images/uf_error.png) rgb(255, 223, 223);width: 661px;position: static;margin-top:10px"><p for="startDate" generated="true" class="errorField">End date must be greater than start date.</p></div>');
      jQuery("input[name='live_acces_begin']").focus();
      return false;
    }
  }
}

jQuery(document).ready(function () {

  //check to see if a Ckeditor has first been loaded on the page
  if(typeof CKEDITOR == "object"){
    CKEDITOR.on('instanceReady', function(ev) {
      ev.editor.on('maximize', function(evt) {
        if(jQuery("#header").length > 0){
          if(jQuery("#header").zIndex() == 9500){
            jQuery("#header").css("z-index", "10009");
           }else{
            jQuery("#header").css("z-index", "9500");
           }
        }
      });
    });
  }

// ******** GLOBAL GRID SORT SYMBOLS ********   jqx-menu-ul

  //add sort asterisk and message after grid loads
  jQuery('.gridwrapper').on('bindingcomplete', function(e) {
    //found two different grid header structures

    //if this is the grade book grid, don't add asterisks
    if(jQuery('.gridwrapper #jqxWidget div').attr('id') != 'manage_gradebook_view_jqxgrid'){
        if(jQuery('.jqx-grid-column-header div .grid-header').length){
        if(!jQuery('.jqx-grid-column-header div').find('.is_sortable').length){ //if asterisk is not there, add it
          jQuery('.jqx-grid-column-header div .grid-header').append('<span class="is_sortable">*</span>');
          jQuery('.jqx-grid-column-header div:first-child div:first-child:not([class])').append('<span class="is_sortable">*</span>');
        }
      }

       else if(jQuery('.jqx-grid-column-header div div span').length){
          if(!jQuery('.jqx-grid-column-header div div span').find('.is_sortable').length){//if asterisk is not there, add it
            jQuery('.jqx-grid-column-header div div span').append('<span class="is_sortable">*</span>');
          }
        }

        //add sort message if it does not exist
        if(!jQuery('.gridwrapper').find('.grid_sortable_message').length){
          jQuery('.gridwrapper').append('<span class="grid_sortable_message">Columns noted with * are sortable</span>');
        }

    }
  });


  jQuery('.view_ans_button').click(function (e) {
    e.preventDefault();
  });

  if (jQuery('#oneline-publication-admin-add-form').length > 0) {
    jQuery('#oneline-publication-admin-add-form').attr(
      "onsubmit",
      "return date_validate_add_publication()")
    jQuery('#edit-submit').attr("onclick",
      "return date_validate_add_publication()");
  }

  jQuery(".datepicker").unbind('mousewheel');

  if (strstr(location.href, 'page-component/deploy') != false) {
    if (jQuery('#edit-field-expected-result').length > 0) {
      jQuery('#edit-field-prerequisite-expiration-und')
        .hide();
      jQuery('#edit-field-prerequisite-expiration-und')
        .prev().hide();
      jQuery('#edit-field-expected-result-und').hide();
      jQuery('#edit-field-expected-result-und').prev()
        .hide();

      jQuery(
          '#edit-field-number-of-prerequisities-n-und-0-value')
        .hide();
      jQuery(
          '#edit-field-number-of-prerequisities-n-und-0-value')
        .prev().hide();

      jQuery('#edit-field-prerequisite-list-und-0-value')
        .hide();
      jQuery(
          'label[for=edit-field-prerequisite-list-und-0-value]')
        .hide();

      jQuery('#edit-field-show-on-und-0-value').hide();
      jQuery('#edit-field-show-on-und-0-value').prev()
        .hide();

      jQuery('#edit-field-parent-id-und-0-value').hide();
      jQuery('#edit-field-parent-id-und-0-value').prev()
        .hide();

    }
  }

  //  alert(location.href)

  adjust_tree_view();

  /* issue related to user's dismiss all issue is fixed here */

  if (jQuery('#component_alert_dismiss_all').length > 0) {
    jQuery('#component_alert_dismiss_all').attr("onclick",
      "hide_dismiss_related_data()");
  }

  if (jQuery('#edit-section').length > 0) {
    jQuery('#edit-section').chosen('destroy');
  }

  /*************************   End  ****************************/

  if (jQuery('.access-code-input').length) {
    jQuery('.access-code-input').mask(
      '*****-*****-*****-*****');
  }
  jQuery('#edit-field-institution-und')
    .change(
      function () {
        jQuery('[name="field_section[und][]"]')
          .html(
            "<option value='0'>- Select Sections -</option>");
      })

  // Hide the page content tile in the Product Management page
  if (window.location.pathname == '/node/add/product') {
    jQuery('#page-title').hide();
    jQuery('.inst_slug_cls').hide();
  }

  /* custom chosen is handled here */

  if (jQuery('#edit-field-product-und').length) {
    jQuery('.chosen-choices li').each(function (index) {
      var currentClass = jQuery(this).attr('class')
      if (currentClass == 'search-field') {
        jQuery(this).children().hide();
        return false;
      }
    });

    jQuery('.chosen-choices').click(function () {
      jQuery('.chosen-choices li').each(function (index) {
        var currentClass = jQuery(this).attr('class')
        if (currentClass == 'search-field') {
          jQuery(this).children().show();
          return false;
        }
      });
    });
  }

  jQuery('#custom-wrapper-onl-pub').hide();

  jQuery('.add_product_form_class').css('color', '#0071B3');
  jQuery('.add_product_form_class').css('cursor', 'pointer');

  jQuery('#custom-wrapper-product').css('color', '#0071B3');
  jQuery('#custom-wrapper-product').css('cursor', 'pointer');

  // For cancelling the entry.
  jQuery('#custom-wrapper-product-cancel').click(function () {
    jQuery('[name="title"]').val("");
    jQuery('[name="field_name[und][0][value]"]').val("");
    jQuery('#c_product').toggle('slow');
    jQuery('#a_product').toggle('slow');
  });

  // Show-hide Create Products and All Products in Product Management page
  jQuery('#create_product').click(function () {
    //jQuery('#c_product').toggle('slow');
    //jQuery('#a_product').toggle('slow');
    jQuery('#c_product').toggle('slow');
    jQuery('#a_product').hide('slow');

  });
  jQuery('#all_product').click(function () {
    /*jQuery('#a_product').toggle('slow');
    jQuery('#c_product').toggle('slow');*/

    jQuery('#c_product').hide('slow');
    jQuery('#a_product').toggle('slow');
  });

  // For edit products
  if (window.location.pathname.indexOf("edit") >= 0) {
    jQuery('#a_product').hide();
    jQuery('#c_product').show();
    jQuery('#v_glossary').hide();
    jQuery('#a_glossary').show();
    jQuery('.inst_slug_cls').hide();
  }

  try {
    jQuery('#custom-wrapper-product')
      .live(
        'click',
        function () {
          jQuery('[name="title"]').val("");
          jQuery(
              '[name="field_name[und][0][value]"]')
            .val("");
        });
  } catch (e) {}

  // For changing the first character of a word in a string to upper case
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() +
        txt.substr(1).toLowerCase();
    });
  }

  function adjust_tree_view() {
    if (jQuery('.jstree').length > 0) {
      jQuery('.jstree li').attr("style",
        "width:75% !important;float:left;");
      //jQuery('.jstree ul').attr("style","margin-top:30px");

    }
  }

  function comm_func() {
    var p_type = jQuery(
        '#edit-field-product-type-und :selected')
      .text();
    var length = p_type.length;
    var flag_one = 0;
    var flag_two = 0;
    var pre_text = "(AC-" + p_type;
    req_text = "";

    /*for ( var i=0; i < length; i++) {
        if (p_type.charAt(i) == "(" ) {
            flag_one = 1;
        }
        if (p_type.charAt(i) == ")" ) {
            flag_two = 1;
        }

        if(flag_one == 1 && flag_two == 0 && p_type.charAt(i) != "("){
            req_text = req_text + p_type.charAt(i);
        }
    }*/
    req_text = req_text.replace("with", "+");
    req_text = pre_text + toTitleCase(req_text) + ")";

    var inst_slug = jQuery(
        '[name="field_online_pub_id_sec_mtr[und][0][value]"]')
      .val() +
      "_inst_slug"; //alert(inst_slug);
    inst_slug = jQuery('#' + inst_slug).text();

    jQuery('[name="field_name[und][0][value]"]').val(
      inst_slug.toUpperCase() + " - " +
      jQuery('[name="title"]').val() + " " +
      req_text);
    jQuery("#custom-wrapper-product").remove();
    jQuery('#edit-title')
      .after(
        '<a id="custom-wrapper-product" class="ui-icon ui-icon-trash" href="javascript:void(0);">Remove</a>');
  }

  var req_text = "";
  jQuery("#edit-field-product-type-und").change(function () {
    comm_func();
  });

  jQuery('.add_product_form_class')
    .click(
      function () {
        var d_id = parseInt(jQuery(this)
          .closest(
            '.add_product_form_class')
          .attr('id'));
        jQuery(
            '[name="field_online_pub_id_sec_mtr[und][0][value]"]')
          .val(d_id);
        jQuery('[name="title"]').val(
          jQuery('#' + d_id + '_pub')
          .text());

        // For Appending
        comm_func();
        var i_slug = jQuery(
            '#' + d_id + '_inst_slug')
          .text();
        jQuery(
            '[name="field_name[und][0][value]"]')
          .val(
            i_slug.toUpperCase() +
            " - " +
            jQuery(
              '#' +
              d_id +
              '_pub')
            .text() +
            " " +
            req_text);
      });

  /* For Component FAQ */
  // Show-hide Create FAQ and All FAQ in FAQ Management page
  jQuery('#create_faq').click(function () {
    jQuery('#a_faq').toggle('slow');
    jQuery('#v_faq').toggle('slow');
  });
  jQuery('#all_faq').click(function () {
    jQuery('#a_faq').toggle('slow');
    jQuery('#v_faq').toggle('slow');
  });
  jQuery('#create_glossary').click(function () {
    jQuery('#a_glossary').toggle('slow');
    jQuery('#v_glossary').toggle('slow');
  });
  jQuery('#all_glossary').click(function () {
    jQuery('#a_glossary').toggle('slow');
    jQuery('#v_glossary').toggle('slow');
  });

  (function ($) {
    Drupal.behaviors.custom_ajax = {
      attach: function (context, settings) {
        if ($('#custom-wrapper-categories', context).length) {
          $.ajax({
            url: '/node/add/components',
            success: function (data) {
              var cat_val = jQuery(
                '[name="cat_nos"]').val();
              var n = cat_val.split(" ");
              for (i = 0; i < n.length; i++) {
                $('option[value=' + n[i] + ']')
                  .attr('selected',
                    'selected');
              }
            }
          });
        }

        adjust_tree_view();

        /* sucess call back */

        if ($("select[name=pub_id]").length > 0) {
          var pub_id = $("select[name=pub_id]").val();
          if ($.trim(pub_id) == '') {
            $('select[name=sec_id]')
              .find('option')
              .remove()
              .end()
              .append(
                '<option selected value="">--Please select a section--</option>');
          }
        }
        /* on selection of institution section will be empty */

        /* reloading for submission attempt section */

        if ($('#submit-answer').length > 0) {
          // window.location.reload();
        }

        /*
        form bite limit excel at the time of answering manages here
         */
        if ($('#formbite-view-form').length > 0) {
          var responSeText = $
            .trim($('#answer_check').text());
          var responSeText = $.trim($(
            '#max_count_status').text());
          if (responSeText == 'max_reached=Y') {
            $('.formbite_submit_button').hide();
            $('.view_ans_button').hide();
            if ($('#formbite-msg').length <= 0) {
              $('#answer_check').hide();
              $('.view_ans_button').empty().after('<h1 style="color:#ff0000" id="formbite-msg">Your attempts Exceeded the allowed limit.</h1>');
              return false;
            }
          }
        }
        /* formbite limit handles managing ends here */

      }
    }

  })(jQuery);

  if (window.location.pathname == '/node/add/generate-access-codes' ||
    window.location.pathname == '/lookup-access-codes' ||
    window.location.pathname == '/messages/new' ||
    jQuery('.add-publications-ul').length > 0) {
    var parent_element_class = 'form-item-title';
    if (window.location.pathname == '/messages/new' ||
      jQuery('.add-publications-ul').length > 0) {
      parent_element_class = 'form-item-recipient';
    }
    var update_element_id = 'edit-title';
    if (window.location.pathname == '/messages/new' ||
      jQuery('.add-publications-ul').length > 0) {
      update_element_id = 'edit-recipient';
    }
    if (window.location.pathname == '/node/add/generate-access-codes') {
      parent_element_class = 'form-item-title';
      update_element_id = 'edit-title';
    }

    jQuery('#page-title').show();
    //jQuery('#edit-title').hide();
    jQuery('.' + parent_element_class).hide();
    jQuery('.online_pub').attr('href',
      'javascript:void(0);');

    try {
      jQuery('.online_pub')
        .live(
          'click',
          function () {
            var id = jQuery(this)
              .attr('id');

            if (jQuery('#sc_' + id).length <= 0) {
              if (jQuery('#' + id +
                  '_pub').length > 0) {
                var $innerText = jQuery(
                    '#' +
                    id +
                    '_pub')
                  .html();
              } else {

                var $innerText = id;
              }

              var html = '<li class="add-publications-li" id="sc_' +
                id +
                '">' +
                $innerText +
                '<a title="Remove" alt="Remove" class="ui-icon ui-icon-trash remove_pub" href="javascript:void(0);" id="removeElement_' +
                id +
                '">Remove</a></li>';
              jQuery(
                  '.add-publications-ul')
                .append(html);
              var pub_ids = jQuery(
                  '#' +
                  update_element_id)
                .val();
              jQuery(
                  '#' +
                  update_element_id)
                .val(
                  pub_ids +
                  id +
                  ',');
            }
          });
    } catch (e) {}

    try {
      jQuery('.remove_pub')
        .live(
          'click',
          function () {
            var id_str = jQuery(this).attr(
              'id');
            var id_arr = id_str
              .split('removeElement_');
            var id = id_arr[1];
            jQuery('#sc_' + id).remove();
            var pub_ids = jQuery(
                '#' + update_element_id)
              .val();
            var pub_ids_new = '';
            if (pub_ids != '') {
              var pub_ids_arr = pub_ids
                .split(',');
              for (var i = 0; i < (pub_ids_arr.length - 1); i++) {
                if (pub_ids_arr[i] != id) {
                  pub_ids_new += pub_ids_arr[i] +
                    ',';
                }
              }
            }
            jQuery('#' + update_element_id)
              .val(pub_ids_new);
          });

    } catch (e) {}

  }

  if (jQuery('form').length) {
    jQuery('form').uniform();
  }
  //Add message title with the required classes to the textarea fields
  jQuery("#alert-admin-add-form .form-textarea-wrapper")
    .prepend(
      '<div class="ui-ckeditor-titlebar ui-widget-header ui-corner-top ui-helper-clearfix"><span class="ui-ckeditor-title">Message</span></div>');
  jQuery(
      "#announcement-admin-add-form .form-textarea-wrapper")
    .prepend(
      '<div class="ui-ckeditor-titlebar ui-widget-header ui-corner-top ui-helper-clearfix"><span class="ui-ckeditor-title">Announcement</span></div>');

  //Script for announcement issue #542

  jQuery(".form-submit").click(function () {
    jQuery(this).datepicker("destroy");
  });

  //slug validation
  jQuery('#edit-slug')
    .keyup(
      function () {
        jQuery('p.errorField').remove();
        var inputVal = jQuery(this).val();
        var numericReg = /^[a-z0-9-]+$/;
        if (!numericReg.test(inputVal)) {
          jQuery(this).parents(
            'div.form-item').addClass(
            'error');
          if (inputVal) {
            jQuery(this)
              .prev()
              .before(
                '<p for="slug" generated="true" class="errorField">The slug you entered is not valid, please only use lowercase letters, numbers, or hyphens.</p>');
          } else {
            jQuery(this)
              .prev()
              .before(
                '<p for="slug" generated="true" class="errorField">Please provide an slug.</p>');
          }
          jQuery(
              '#institution-admin-add-page .form-submit')
            .attr('disabled',
              'disabled');
        } else {
          jQuery(this).parents(
              'div.form-item')
            .removeClass('error');
          jQuery(
              '#institution-admin-add-page .form-submit')
            .removeAttr('disabled');
        }
      });
  //broadcast validation in alert page
  jQuery('input[name="end_broadcast"]')
    .blur(
      function () {
        var begin = jQuery(
            'input[name="begin_broadcast"]')
          .val();
        var end = jQuery(
            'input[name="end_broadcast"]')
          .val();
        if (new Date(end) <= new Date(begin)) {
          jQuery(
              'input[name="end_broadcast"]')
            .parents('div.form-item')
            .addClass('error');
          jQuery(
              'input[name="end_broadcast"]')
            .prev()
            .before(
              '<p for="endBroadcast" generated="true" class="errorField">Must be greater than #beginBroadcast.</p>');
        }
      });
  //validation for institution
  jQuery('#institution-admin-add-page #edit-submit')
    .click(
      function () {
        var insName = jQuery('#edit-ins-name')
          .val();
        var slug = jQuery('#edit-slug').val();
        if (!insName) {
          jQuery('#edit-ins-name').parents(
            'div.form-item').addClass(
            'error');
          jQuery('#edit-ins-name')
            .prev()
            .before(
              '<p for="slug" generated="true" class="errorField">This field is required.</p>');
        }
        if (!slug) {
          jQuery('#edit-slug').parents(
            'div.form-item').addClass(
            'error');
          jQuery('#edit-slug')
            .prev()
            .before(
              '<p for="slug" generated="true" class="errorField">Please provide an slug.</p>');
        }
        jQuery('#institution-admin-add-page')
          .prev().hide();
      });

  jQuery("#SelectAll").click(function () {
    jQuery("#messages_jqxgrid").jqxGrid('selectallrows');
    return false;
  });

  if(jQuery('#autologout-confirm').length){
    jQuery('#autologout-confirm')
    .live(
      "dialogopen",
      function (event, ui) {
        var left = (jQuery(window).width() - 450) * 0.5;
        var top = jQuery(document).height() - 250;
        jQuery('#autologout-confirm').parent()
          .css({
            width: '450px',
            zIndex: 999999,
            left: left + 'px',
            top: '-' + top + 'px',
            position: 'relative'
          });
        jQuery('#autologout-confirm')
          .parent()
          .find('.ui-button:eq(1)')
          .insertBefore(
            jQuery(
              '#autologout-confirm')
            .parent()
            .find(
              '.ui-button:eq(0)'));
      });
  }

      if (jQuery("#main_navigation").length) {
        jQuery('#main_navigation').slicknav({
          prependTo: '#main-menu',
          duration: '330',
          duplicate: 'false',
          closeOnClick: 'true',
          beforeOpen: function () {
            jQuery('#block-system-navigation').slicknav('close');
            jQuery('#block-menu-menu-report-menu').slicknav('close');
            jQuery('#folder_tree').slicknav('close');
          },
        });
      }
      if (jQuery("#block-system-navigation").length) {
        jQuery('#block-system-navigation').slicknav({
          prependTo: '#name-and-slogan',
          duration: '330',
          duplicate: 'false',
          closeOnClick: 'true',
          beforeOpen: function () {
            jQuery('#main_navigation').slicknav('close');
            jQuery('#block-menu-menu-report-menu').slicknav('close');
            jQuery('#folder_tree').slicknav('close');
          },
        });
      }
      if (jQuery("#block-menu-menu-report-menu").length) {
        jQuery('#block-menu-menu-report-menu').slicknav({
          prependTo: '#name-and-slogan',
          duration: '330',
          duplicate: 'false',
          closeOnClick: 'true',
          beforeOpen: function () {
            jQuery('#main_navigation').slicknav('close');
            jQuery('#block-system-navigation').slicknav('close');
            jQuery('#folder_tree').slicknav('close');
          },
        });
      }
      if (jQuery("#folder_tree").length) {
        jQuery('#folder_tree').slicknav({
          prependTo: '#name-and-slogan',
          duration: '330',
          duplicate: 'false',
          closeOnClick: 'true',
          beforeOpen: function () {
            jQuery('#main_navigation').slicknav('close');
            jQuery('#block-system-navigation').slicknav('close');
            jQuery('#block-menu-menu-report-menu').slicknav('close');
          },
        });
      }

      if (jQuery(window).width() < 767 && jQuery('#block-block-2 .content').length > 0) {
        var string = jQuery('#block-block-2 .content').html();
        var newString = string.replace('|', '<br />');
        jQuery('#block-block-2 .content').html(newString);
      }

});
jQuery(window).load(function () {
  setTimeout(function () {
    if (jQuery("#admin-menu-wrapper").length) {
      var hei = jQuery("#admin-menu-wrapper").css("height");
      var hei = jQuery("#page-wrapper").css({
        "margin-top": hei
      });
    }

  }, 1000);

});
jQuery(window).resize(function () {
  setTimeout(function () {
    if (jQuery("#admin-menu-wrapper").length) {
      var hei = jQuery("#admin-menu-wrapper").css("height");
      var hei = jQuery("#page-wrapper").css({
        "margin-top": hei
      });
    }

  }, 1000);

});

Drupal.behaviors.formbite_view = {
  attach: function (context, settings) {
    jQuery.fn.correct_answer = function (correct_answer_div, answer_array, count, page_comp_id, type) {
      var dataobj = jQuery.parseJSON(answer_array);

      console.log(dataobj);

      if (count > 0 && dataobj.length > 0) {
        var color = jQuery(".formbite_wrapper_" + page_comp_id).css("background-color");
        var temp_store;
        jQuery(".formbite_wrapper_" + page_comp_id).css("background-color", "");
        if (type == 'textarea' || type == 'textfield') {
          temp_store = jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').val();
          jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').val(dataobj.join(','));
          jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').prop("readonly", true);
          jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').prop("disabled", true);
          jQuery(".formbite_wrapper_" + page_comp_id).find("#answer_check").css("display", "none");
          jQuery(".formbite_wrapper_" + page_comp_id).find(".view_ans_button").css("display", "none");
          jQuery(".formbite_wrapper_" + page_comp_id).find(".formbite_submit_button").css("display", "none");

          setTimeout(function () {
            jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').val(temp_store);
            jQuery(".formbite_wrapper_" + page_comp_id).css("background-color", color);
            jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').prop("readonly", false);
            jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').prop("disabled", false);
            jQuery(".formbite_wrapper_" + page_comp_id).find("#answer_check").css("display", "block");
            jQuery(".formbite_wrapper_" + page_comp_id).find(".view_ans_button").css("display", "block");
            jQuery(".formbite_wrapper_" + page_comp_id).find(".formbite_submit_button").css("display", "block");
          }, 5000);

        } else if (type == 'radios') {
          temp_store = jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class:checked').val();
          jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class:checked').prop("checked", false);
          jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').each(function () {
            if (jQuery(this).val() == dataobj[0]) {
              jQuery(this).prop("checked", true);
            } else {
              jQuery(this).prop("checked", false);
            }
          });
          jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').prop("disabled", true);
          jQuery(".formbite_wrapper_" + page_comp_id).find("#answer_check").css("display", "none");
          jQuery(".formbite_wrapper_" + page_comp_id).find(".view_ans_button").css("display", "none");
          jQuery(".formbite_wrapper_" + page_comp_id).find(".formbite_submit_button").css("display", "none");
          setTimeout(function () {
            jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').each(function () {
              if (jQuery(this).val() == temp_store) {
                jQuery(this).prop("checked", true);
              } else {
                jQuery(this).prop("checked", false);
              }
            });
            jQuery(".formbite_wrapper_" + page_comp_id).css("background-color", color);
            jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').prop("disabled", false);
            jQuery(".formbite_wrapper_" + page_comp_id).find("#answer_check").css("display", "block");
            jQuery(".formbite_wrapper_" + page_comp_id).find(".view_ans_button").css("display", "block");
            jQuery(".formbite_wrapper_" + page_comp_id).find(".formbite_submit_button").css("display", "block");
          }, 5000);

        } else if (type == 'checkboxes') {
          var temp_store = [];
          jQuery(".formbite_wrapper_" + page_comp_id + ' input.fb_answer_class:checked').each(function () {
            temp_store.push(jQuery(this).val());
          });

          jQuery(".formbite_wrapper_" + page_comp_id).find('input.fb_answer_class:checked').prop("checked", false);
          jQuery(".formbite_wrapper_" + page_comp_id + ' input.fb_answer_class').each(function () {
            if (jQuery.inArray(jQuery(this).val().toString(), dataobj) !== -1) {
              jQuery(this).prop("checked", true);
            } else {
              jQuery(this).prop("checked", false);
            }
          });
          jQuery(".formbite_wrapper_" + page_comp_id).find('input.fb_answer_class').prop("disabled", true);
          jQuery(".formbite_wrapper_" + page_comp_id).find("#answer_check").css("display", "none");
          jQuery(".formbite_wrapper_" + page_comp_id).find(".view_ans_button").css("display", "none");
          jQuery(".formbite_wrapper_" + page_comp_id).find(".formbite_submit_button").css("display", "none");
          setTimeout(function () {
            jQuery(".formbite_wrapper_" + page_comp_id + ' input.fb_answer_class').each(function () {
              if (jQuery.inArray(jQuery(this).val().toString(), temp_store) !== -1) {
                jQuery(this).prop("checked", true);
              } else {
                jQuery(this).prop("checked", false);
              }
            });
            jQuery(".formbite_wrapper_" + page_comp_id).css("background-color", color);
            jQuery(".formbite_wrapper_" + page_comp_id).find('input.fb_answer_class').prop("disabled", false);
            jQuery(".formbite_wrapper_" + page_comp_id).find("#answer_check").css("display", "block");
            jQuery(".formbite_wrapper_" + page_comp_id).find(".view_ans_button").css("display", "block");
            jQuery(".formbite_wrapper_" + page_comp_id).find(".formbite_submit_button").css("display", "block");
          }, 5000);
        } else if(type == 'select'){
          temp_store = jQuery(".formbite_wrapper_" + page_comp_id).find('select.fb_answer_class.form-select').val();
          jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').val(dataobj.join(','));
          jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').prop("readonly", true);
          jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').prop("disabled", true);
          jQuery(".formbite_wrapper_" + page_comp_id).find("#answer_check").css("display", "none");
          jQuery(".formbite_wrapper_" + page_comp_id).find(".view_ans_button").css("display", "none");
          jQuery(".formbite_wrapper_" + page_comp_id).find(".formbite_submit_button").css("display", "none");

          setTimeout(function () {
            jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').val(temp_store);
            jQuery(".formbite_wrapper_" + page_comp_id).css("background-color", color);
            jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').prop("readonly", false);
            jQuery(".formbite_wrapper_" + page_comp_id).find('.fb_answer_class').prop("disabled", false);
            jQuery(".formbite_wrapper_" + page_comp_id).find("#answer_check").css("display", "block");
            jQuery(".formbite_wrapper_" + page_comp_id).find(".view_ans_button").css("display", "block");
            jQuery(".formbite_wrapper_" + page_comp_id).find(".formbite_submit_button").css("display", "block");
          }, 5000);
        } else {
          jQuery('.gridelements_a').show();
          setTimeout(function () {
            jQuery('.gridelements_a').hide();
          }, 5000);
        }

      }
    }
  }
};

function hide_dismiss_related_data() {
  jQuery('#component_alert').hide();
}

function dismiss_list_data(counter) {
  if (parseInt(counter)) {
    jQuery('.dismiss_class_' + counter).hide(200, function () {
      var all = 0;
      jQuery('#component_alert ul > li').each(function () {
        if (jQuery(this).css('display') != 'none') {
          all = 1;
        }
      });
      if (all == 0) {
        jQuery('#component_alert_dismiss_all').hide();
      }
    });
  }
}

function show_deploy_colorbox_component_edit(edit_id) {

  var burl = Drupal.settings.webcom.base_url;

  if (jQuery('#deployeddata').length == 0) {
    var questionAnswerForm = jQuery("<div id='deployeddata'/>");
    jQuery("body").append(questionAnswerForm);
  } else {
    jQuery('#deployeddata').html('');
  }
  jQuery('#deployeddata').colorbox({

    href: burl + '/deploy/compid/' + edit_id + '?ajax',
    open: true,
    inine: true,
    title: "Deployed",
    transition: "elastic",
    width: "720px",
    height: "55%",
    opacity: "0.55",
    iframe: true,
    fastIframe: false,
    scrolling: true,
    onComplete: function () {
      jQuery("iframe.cboxIframe").contents().find("#admin-menu")
        .attr("style", "display:none");
    }
  });
}

Drupal.behaviors.customjs = {
  attach: function (context) {
    jQuery(".form-submit").mousedown(function () {
      jQuery('.xdsoft_datetimepicker').hide();
    });

    jQuery.fn.uniform = function (settings) {
      settings = jQuery.extend({
        valid_class: 'valid',
        invalid_class: 'invalid',
        focused_class: 'focused',
        holder_class: 'form-item',
        field_selector: 'input, select, textarea'
      }, settings);

      return this.each(function () {
        var form = jQuery(this);

        // Focus specific control holder
        var focusControlHolder = function (element) {
          var parent = element.parent();

        };

        // Select form fields and attach them higlighter functionality
        form.find(settings.field_selector).focus(
          function () {
            form.find('.' + settings.focused_class)
              .removeClass(settings.focused_class);
            focusControlHolder(jQuery(this));
          }).blur(
          function () {
            form.find('.' + settings.focused_class)
              .removeClass(settings.focused_class);
          });
      });
    };

  }
};

function sendinstitutionIDinternalmsg(instID, is_student) {

  var dataString = 'id=' + instID + '&is_student=' + is_student;
  //alert(instID);
  jQuery
    .ajax({
      type: "POST",
      url: "getpublication",
      data: dataString,
      cache: false,
      success: function (html) {
        jQuery("#coursePubID").html(html);

        if (!jQuery.trim(html)) {
          jQuery("#coursePubID")
            .html(
              '<option value="">-- Please select an online publication --</option>');
        } else {
          jQuery("#coursePubID").html(html);
        }

        jQuery("#secPubID")
          .html(
            '<option value="">-- Please select a section --</option>');
      }
    });

}

function sendcourseIDinternalmsg(pubID, is_student) {
  var dataString = 'id=' + pubID + '&is_student=' + is_student;

  jQuery
    .ajax({
      type: "POST",
      url: "getsection",
      data: dataString,
      cache: false,
      success: function (html) {
        //jQuery("#secPubID").html(html);
        if (!jQuery.trim(html)) {
          jQuery("#secPubID")
            .html(
              '<option value="">-- Please select a section --</option>');
        } else {
          jQuery("#secPubID").html(html);
        }
      }
    });

}

// This function is similar to the one below it (sendinstitutionIDcompo).
// It is a separate function because on the Add: Page Component screen, there are two
// grids, Select Component and Select Prerequisite Component. When choosing an institution
// in the search box of one of the grids, we don't want both search boxes to update
// their course fields (#courseIDMAP and #courseIDMA) with the courses of the chosen institution.
function sendinstitutionIDcompo_preReqGrid(instID, is_student) {
  var burl = Drupal.settings.webcom.base_url;

  var dataString = 'id=' + instID + '&is_student=' + is_student;
  jQuery
    .ajax({
      type: "POST",
      url: burl + "/messages/getpublication",
      data: dataString,
      cache: false,
      success: function (html) {
        if (!jQuery.trim(html)) {
          jQuery("#courseIDMAP")
            .html(
              '<option value="">-- Please select an online publication --</option>');
        } else {
          jQuery("#courseIDMAP").html(html);
        }
      }
    });
}

// (function ($) {

//   var lilength = $('#component_alert ul li').length;
//   if (lilength > 0) {
//     $('#component_alert').delay(500).slideDown(1000);
//   }

//   $('.component_alert_dismiss_link').live("click", function (ev) {

//     ev.preventDefault();
//     var idToHide = '#li' + $(this).attr("id");
//     $(idToHide).hide();
//     $.post($(this).attr("href"));
//     //$.cookie('user_cookie', null);
//     return false;
//   });
//   $('#component_alert_dismiss_all_link').live("click", function (ev) {

//     ev.preventDefault();
//     $('#component_alert').hide();
//     $.post($(this).attr("href"));
//     //$.cookie('user_cookie', null);
//     return false;
//   });
// })(jQuery);

// This function gets courses from the chosen institution and returns the courses as an html select list.
function sendinstitutionIDcompo(instID, is_student) {
  var burl = Drupal.settings.webcom.base_url;

  var dataString = 'id=' + instID + '&is_student=' + is_student;
  //alert(instID);
  jQuery
    .ajax({
      type: "POST",
      url: burl + "/messages/getpublication",
      data: dataString,
      cache: false,
      success: function (html) {
        jQuery("#courseIDmr").html(html);

        if (!jQuery.trim(html)) {
          jQuery("#courseIDmr")
            .html(
              '<option value="">-- Please select an online publication --</option>');
          jQuery("#courseID")
            .html(
              '<option value="">-- Please select an online publication --</option>');
          jQuery("#courseIDS")
            .html(
              '<option value="">-- Please select an online publication --</option>');
          jQuery("#courseIDMA")
            .html(
              '<option value="">-- Please select an online publication --</option>');
          jQuery("#pub_namemr")
            .html(
              '<option value="">-- Please select an online publication --</option>');
          jQuery("#pub_name")
            .html(
              '<option value="">-- Please select an online publication --</option>');
          jQuery("#op_gc")
            .html(
              '<option value="">-- Please select an online publication --</option>');

        } else {
          jQuery("#courseIDmr").html(html);
          jQuery("#courseID").html(html);
          jQuery("#courseIDS").html(html);
          jQuery("#courseIDMA").html(html);
          jQuery("#pub_namemr").html(html);
          jQuery("#pub_name").html(html);
          jQuery("#op_gc").html(html);
        }

        jQuery("#secIDmr")
          .html(
            '<option value="">-- Please select a section --</option>');
        jQuery("#secID")
          .html(
            '<option value="">-- Please select a section --</option>');
        jQuery("#secIDS")
          .html(
            '<option value="">-- Please select a section --</option>');
        jQuery("#secIDMA")
          .html(
            '<option value="">-- Please select a section --</option>');
        jQuery("#sec_namemr")
          .html(
            '<option value="">-- Please select a section --</option>');
        jQuery("#sec_name")
          .html(
            '<option value="">-- Please select a section --</option>');
        jQuery("#sec_gc")
          .html(
            '<option value="">-- Please select a section --</option>');

      }
    });

}

function sendinstitutionIDcompoLTI(instID, is_student) {
  var burl = Drupal.settings.webcom.base_url;

  var dataString = 'id=' + instID + '&is_student=' + is_student;
  //alert(instID);
  jQuery
    .ajax({
      type: "POST",
      url: burl + "/messages/getpublicationLTI",
      data: dataString,
      cache: false,
      success: function (html) {
        jQuery("#courseIDmr").html(html);

        if (!jQuery.trim(html)) {
          jQuery("#courseIDmr")
            .html(
              '<option value="">-- Please select an online publication --</option>');
          jQuery("#courseID")
            .html(
              '<option value="">-- Please select an online publication --</option>');
          jQuery("#courseIDS")
            .html(
              '<option value="">-- Please select an online publication --</option>');
          jQuery("#courseIDMA")
            .html(
              '<option value="">-- Please select an online publication --</option>');
          jQuery("#pub_namemr")
            .html(
              '<option value="">-- Please select an online publication --</option>');
          jQuery("#pub_name")
            .html(
              '<option value="">-- Please select an online publication --</option>');
          jQuery("#op_gc")
            .html(
              '<option value="">-- Please select an online publication --</option>');

        } else {
          jQuery("#courseIDmr").html(html);
          jQuery("#courseID").html(html);
          jQuery("#courseIDS").html(html);
          jQuery("#courseIDMA").html(html);
          jQuery("#pub_namemr").html(html);
          jQuery("#pub_name").html(html);
          jQuery("#op_gc").html(html);
        }

        jQuery("#secIDmr")
          .html(
            '<option value="">-- Please select a section --</option>');
        jQuery("#secID")
          .html(
            '<option value="">-- Please select a section --</option>');
        jQuery("#secIDS")
          .html(
            '<option value="">-- Please select a section --</option>');
        jQuery("#secIDMA")
          .html(
            '<option value="">-- Please select a section --</option>');
        jQuery("#sec_namemr")
          .html(
            '<option value="">-- Please select a section --</option>');
        jQuery("#sec_name")
          .html(
            '<option value="">-- Please select a section --</option>');
        jQuery("#sec_gc")
          .html(
            '<option value="">-- Please select a section --</option>');

      }
    });

}

// This function is similar to the one below it (sendcourseIDcompo).
// It is a separate function because on the Add: Page Component screen, there are two
// grids, Select Component and Select Prerequisite Component. When choosing a course
// in the search box of one of the grids, we don't want both search boxes to update
// their section field (#secIDMAP and #secIDMA) with the sections of the chosen course.
function sendcourseIDcompo_preReqGrid(pubID, is_student) {
  var burl = Drupal.settings.webcom.base_url;
  var dataString = 'id=' + pubID + '&is_student=' + is_student;

  jQuery.ajax({
    type: "POST",
    url: burl + "/messages/getsection",
    data: dataString,
    cache: false,
    success: function (html) {
      if (!jQuery.trim(html)) {
        jQuery("#secIDMAP")
          .html(
            '<option value="">-- Please select a section --</option>');
      } else {
        jQuery("#secIDMAP").html(html);
      }
    }
  });
}

// This function gets sections from the chosen course and returns the sections as an html select list.
function sendcourseIDcompo(pubID, is_student, allow_empty = 0) {
  var burl = Drupal.settings.webcom.base_url;
  var dataString = 'id=' + pubID + '&is_student=' + is_student + '&allow_empty=' + allow_empty;

  jQuery.ajax({
    type: "POST",
    url: burl + "/messages/getsection",
    data: dataString,
    cache: false,
    success: function (html) {
      //jQuery("#secPubID").html(html);
      if (!jQuery.trim(html)) {
        jQuery("#sec_namemr").html('<option value="">-- Please select a section --</option>');
        jQuery("#secID").html('<option value="">-- Please select a section --</option>');
        jQuery("#secIDS").html('<option value="">-- Please select a section --</option>');
        jQuery("#secIDMA").html('<option value="">-- Please select a section --</option>');
        jQuery("#secIDmr1").html('<option value="">-- Please select a section --</option>');
        jQuery("#sec_name").html('<option value="">-- Please select a section --</option>');
        jQuery("#sec_gc").html('<option value="">-- Please select a section --</option>');
      } else {
        jQuery("#secIDmr").html(html);
        jQuery("#secID").html(html);
        jQuery("#secIDS").html(html);
        jQuery("#secIDMA").html(html);
        jQuery("#sec_namemr").html(html);
        jQuery("#sec_name").html(html);
        jQuery("#sec_gc").html(html);
      }
    }
  });
}

// This function gets sections from the chosen course and returns the sections as an html select list.
function sendcourseIDcompoLTI(pubID, is_student, allow_empty = 0) {
  var burl = Drupal.settings.webcom.base_url;
  var dataString = 'id=' + pubID + '&is_student=' + is_student + '&allow_empty=' + allow_empty;

  jQuery.ajax({
    type: "POST",
    url: burl + "/messages/getsectionLTI",
    data: dataString,
    cache: false,
    success: function (html) {
      //jQuery("#secPubID").html(html);
      if (!jQuery.trim(html)) {
        jQuery("#sec_namemr").html('<option value="">-- Please select a section --</option>');
        jQuery("#secID").html('<option value="">-- Please select a section --</option>');
        jQuery("#secIDS").html('<option value="">-- Please select a section --</option>');
        jQuery("#secIDMA").html('<option value="">-- Please select a section --</option>');
        jQuery("#secIDmr1").html('<option value="">-- Please select a section --</option>');
        jQuery("#sec_name").html('<option value="">-- Please select a section --</option>');
        jQuery("#sec_gc").html('<option value="">-- Please select a section --</option>');
      } else {
        jQuery("#secIDmr").html(html);
        jQuery("#secID").html(html);
        jQuery("#secIDS").html(html);
        jQuery("#secIDMA").html(html);
        jQuery("#sec_namemr").html(html);
        jQuery("#sec_name").html(html);
        jQuery("#sec_gc").html(html);
      }
    }
  });
}


 //Limit submit and save buttons from being double clicked using the Jquery Block UI
function prevent_multi_clicks(){
  //block submit buttons
  jQuery( "#edit-submit" ).on( "click", function() {
    jQuery(".buttonHolder").block({
      message: null,
      overlayCSS: { backgroundColor: '#f9f9f9' }
    });

    //wait 3 seconds, then unblock
    setTimeout(function() {jQuery(".buttonHolder").unblock()}, 3000);
  });

  //block save buttons
  jQuery( "#edit-save" ).on( "click", function() {
    jQuery(".buttonHolder").block({
      message: null,
      overlayCSS: { backgroundColor: '#f9f9f9' }
    });

    //wait 3 seconds, then unblock
    setTimeout(function() {jQuery(".buttonHolder").unblock()}, 3000);
  });

}

function formbite_sizeing(){
  if (jQuery('#dynamic_grid #gridMaker').length > 0) {
    gridWidth = jQuery('#page-title').width() + parseInt(jQuery('#page-title').css('padding-left')) + parseInt(jQuery('#page-title').css('padding-right')) - parseInt(jQuery('.ui-dialog-content').css('padding-left')) - parseInt(jQuery('.ui-dialog-content').css('padding-right')) - parseInt(jQuery('#formbite-component-entityform-edit-form .inlineLabels').css('padding-right')) - parseInt(jQuery('#formbite-component-entityform-edit-form .inlineLabels').css('padding-left')) - 10;
    jQuery('#dynamic_grid').width(gridWidth);
  }
}
