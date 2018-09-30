if (jQuery) (function ($) {
    $.extend($.fn, {
        pulldown: function (method, data) {
            switch (method) {
                case 'show':
                    show(null, $(this));
                    return $(this);
                case 'hide':
                    hide();
                    return $(this);
                case 'attach':
                    return $(this).attr('data-pulldown', data);
                case 'detach':
                    hide();
                    return $(this).removeAttr('data-pulldown');
                case 'disable':
                    return $(this).addClass('pulldown-disabled');
                case 'enable':
                    hide();
                    return $(this).removeClass('pulldown-disabled');
            }
        }
    });

    function show(event, object) {

        var trigger = event ? $(this) : object,
            pulldown = $(trigger.attr('data-pulldown')),
            isOpen = trigger.hasClass('pulldown-open');

        // In some cases we don't want to show it
        if (event) {
            if ($(event.target).hasClass('pulldown-ignore')) return;

            event.preventDefault();
            event.stopPropagation();
        } else {
            if (trigger !== object.target && $(object.target).hasClass('pulldown-ignore')) return;
        }
        hide();

        if (isOpen || trigger.hasClass('pulldown-disabled')) return;

        // Show it
        trigger.addClass('pulldown-open');
        pulldown
            .data('pulldown-trigger', trigger)
            .show();

        // Position it
        position();

        // Trigger the show callback
        pulldown
            .trigger('show', {
                pulldown: pulldown,
                trigger: trigger
            });

    }

    function hide(event) {

        // In some cases we don't hide them
        var targetGroup = event ? $(event.target).parents().addBack() : null;

        // Are we clicking anywhere in a pulldown?
        if (targetGroup && targetGroup.is('.pulldown')) {
            // Is it a pulldown menu?
            if (targetGroup.is('.pulldown-menu')) {
                // Did we click on an option? If so close it.
                if (!targetGroup.is('A')) return;
            } else {
                // Nope, it's a panel. Leave it open.
                return;
            }
        }

        // Hide any pulldown that may be showing
        $(document).find('.pulldown:visible').each(function () {
            var pulldown = $(this);
            pulldown
                .hide()
                .removeData('pulldown-trigger')
                .trigger('hide', { pulldown: pulldown });
        });

        // Remove all pulldown-open classes
        $(document).find('.pulldown-open').removeClass('pulldown-open');

    }

    function position() {
        var pulldown = $('.pulldown:visible').eq(0),
            trigger = pulldown.data('pulldown-trigger'),
            hOffset = trigger ? parseInt(trigger.attr('data-horizontal-offset') || 0, 10) : null,
            vOffset = trigger ? parseInt(trigger.attr('data-vertical-offset') || 0, 10) : null;

        if (pulldown.length === 0 || !trigger) return;

        // Position the pulldown relative-to-parent...
        if (pulldown.hasClass('pulldown-relative')) {
            pulldown.css({
                left: pulldown.hasClass('pulldown-anchor-right') ?
                trigger.position().left - (pulldown.outerWidth(true) - trigger.outerWidth(true)) - parseInt(trigger.css('margin-right'), 10) + hOffset :
                trigger.position().left + parseInt(trigger.css('margin-left'), 10) + hOffset,
                top: trigger.position().top + trigger.outerHeight(true) - parseInt(trigger.css('margin-top'), 10) + vOffset
            });
        } else {
            // ...or relative to document
            pulldown.css({
                left: pulldown.hasClass('pulldown-anchor-right') ?
                trigger.offset().left - (pulldown.outerWidth() - trigger.outerWidth()) + hOffset : trigger.offset().left + hOffset,
                top: trigger.offset().top + trigger.outerHeight() + vOffset
            });
        }
    }

    $(document).on('click.pulldown', '[data-pulldown]', show);
    $(document).on('click.pulldown', hide);
    $(window).on('resize', position);

})(jQuery);