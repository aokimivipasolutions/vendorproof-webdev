jQuery(function($) {
    var $con = $('.dashboard');
    var wsUrl = '/ws/dashboard-stats';
    Highcharts.setOptions({
        colors: [
            '#39bcf9',//Light Blue
            '#38c419',//Green
            '#e50b28',//Red
            '#57575b',
            '#b7b7b7',
            '#ef944a'
        ]
    });

    var _reportCache = {};

    var friendlyNumberFormat = function(dataset) {
        //Only meant to be used by the report figures and because of that it won't handle the graphing format
        for(var idx in dataset)
        {
            var data = dataset[idx];
            var number = data.value;
            if (number > 1000000000000) {
                data.value = Math.round(number / 1000000000000) + 't';
            } else if (number > 1000000000) {
                data.value = Math.round(number / 1000000000) + 'b';
            } else if (number > 1000000) {
                data.value = Math.round(number / 1000000) + 'm';
            } else if (number > 1000) {
                data.value = Math.round(number / 1000) + 'k';
            } else {
                //do nothing
            }
        }
        return dataset;
    };

    var addReportCacheByKey = function(type, key, data, force) {
        if (!getReportCacheByKey(type, key) || force) {
            if (!getReportCacheByKey(type)) {
                _reportCache[type] = {};
            }

            _reportCache[type][key] = data;
        }
    };

    var addReportCacheByKeys = function(type, keys, data, force) {
        var keyData;
        $.each(keys, function(idx, key) {
            keyData = {};

            if ($.isArray(data)) {
                $.each(data, function(idx, d) {
                    if (d.progName == key) {
                        keyData = d;
                    }
                });
            } else {
                if (data) {
                    keyData = data;
                }
            }

            addReportCacheByKey(type, key, keyData, force);
        });
    };

    var getReportCacheByKey = function(type, key) {
        if (!key) {
            return _reportCache[type] == undefined ? false : _reportCache[type];
        } else {
            return _reportCache[type] == undefined ? false :
                    _reportCache[type][key] == undefined ? false : _reportCache[type][key];
        }
    };

    var getReportCacheByKeys = function(type, keys) {
        var data = [], cache;

        if (!getReportCacheByKey(type)) {
            return keys;
        }

        $.each(keys, function(idx, cacheKey) {
            cache = getReportCacheByKey(type, cacheKey);
            if (cache) {
                data.push(cache);
            }
        });

        return (keys.length == 1 ? data[0] : data);
    };

    var getMissingCacheKeys = function(type, keys) {
        var keyList = [];

        if (!getReportCacheByKey(type)) {
            return keys;
        }

        $.each(keys, function(idx, cacheKey) {
            if (cacheKey.length && !getReportCacheByKey(type, cacheKey)) {
                keyList.push(cacheKey);
            }
        });

        return keyList;
    };

    var getReportData = function getReportData(wsUrl, reportType, reportKeys, callback) {
        var reportKeysList = reportKeys == undefined ? [] : reportKeys.split('|');
        var missingCacheKeys = getMissingCacheKeys(reportType, reportKeysList);

        if (missingCacheKeys.length > 0) {
            $.getJSON(wsUrl, {type: reportType, report: missingCacheKeys.join('|'), ts: +(new Date())}, function(result) {
                addReportCacheByKeys(reportType, missingCacheKeys, result);
                callback(getReportCacheByKeys(reportType, reportKeysList));
            });
        } else {
            callback(getReportCacheByKeys(reportType, reportKeysList));
        }
    };

    var redirect = function redirect(url) {
        window.location = url;
    };

//    var showTab = function showTab(idx) {
//        var $activeTc = $con.find('.tab-content').eq(idx);
//        $activeTc.addClass('active').siblings().removeClass('active');
//        drawReports($activeTc.find('.reports'));
//    };

    var drawReports = function loadReports($con) {
        $con.find('.report').each(function() {
            var $report = $(this);
            var wsUrl = $con.data('webService');

            $report.find('.delayed-content').each(function() {
                var $delayed = $(this);
                var $template = $delayed.find('.template');
                var reportType = $delayed.data('reportType');
                var reportKeys = $delayed.data('reportKey');

                if ($delayed.data('loaded') || !reportType || !$template.length) {
                    return;
                }

                //Test data
//                $delayed.html(tmpl($template.get(0).innerHTML, {data: __holderData[reportKeys]})).removeClass('loading');
//                drawGraphs($delayed, __holderData[reportKeys]);

                getReportData(wsUrl, reportType, reportKeys, function(result) {
                    $delayed.data('loaded', true);
                    $delayed.html(tmpl($template.get(0).innerHTML, {data: friendlyNumberFormat(result)})).removeClass('loading');
                    drawGraphs($delayed, result);
                });
            });

        });
    };


    var drawGraphs = function drawGraphs($context, wsData) {
        $context.find('.graph').each(function(idx) {
            drawGraph($(this), $.isArray(wsData) ? wsData[idx] : wsData);
        });
    };

    var drawGraph = function drawGraph($graph, wsData) {
        var config = $graph.data();

        var $highchartsGraph = $('<div class="highcharts-graph" />').appendTo($graph);

        if (config.title != false) {
            $graph.prepend($('<h2 />').text(wsData.label));
        }

        switch (config.type) {
//            case "pie":
//                google.load('visualization', '1', {
//                    callback: function(){ drawPieChart($highchartsGraph, $googleControls, wsData, config); },
//                    packages:['corechart', 'controls']
//                });
//                break;
            case "semi-circle":
                drawSemiCircle($highchartsGraph, wsData, config);
                break;
//            case "line":
//                google.load('visualization', '1', {
//                    callback: function(){ drawLineChart($highchartsGraph, wsData, config); },
//                    packages:['corechart']
//                });
//                break;
//            case "table":
//                google.load('visualization', '1', {
//                    callback: function(){ drawTableChart($highchartsGraph, wsData, config); },
//                    packages:['table', 'controls']
//                });
//                break;
//            case "gauge":
//                google.load('visualization', '1', {
//                    callback: function(){ drawGaugeChart($highchartsGraph, wsData, config); },
//                    packages:['gauge']
//                });
//                break;
        }
    };

    var drawSemiCircle = function($el, wsData, config) {
        var rowData = wsData.detail.rows.slice();
        var rows = [];

        for(idx in rowData)
        {
            //Because of java code we need to get the array'd object
            var row = rowData[idx][0];

            //Let's not add 'empty' data or data that displays nothing
            if(row.value && row.value > 0) {
                var next = row.next;
                rows.push({
                    redirect: redirect,
                    redirectLink: row.next,
                    name: row.label,
                    y: row.value,
                    color: row.color
                });
            }
        }

        var options = {
            chart: {
                type: 'pie',
                height: 450,
                width: 450
            },
//            title: {
//                text: wsData.label.replace(/\s/g,'<br/>'),
//                align: 'center',
//                verticalAlign: 'middle',
//                y: 70
//            },
            noData: {
                style: {
                    fontSize: '13px',
                    color: '#303030'
                }
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function() {
                                this.redirect(this.redirectLink);
                            }
                        }
                    },
                    tooltip: {
                        pointFormatter: function() {
                            return '<span>'+this.label+'</span>';
                        }
                    }
                },
                pie: {
                    minSize: 400,
                    dataLabels: {
                        enabled: true,
                        formatter: function() {
                            return '<div class="row-label">'+this.key+'</div>';
                        },
                        distance: -50,
                        y: -5,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '14px',
                            color: 'white',
                            textShadow: '0px 1px 2px black'
                        },
                        useHTML: true
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%']
                }
            },
            series: [{
                name: 'Vendors',
                innerSize: '50%',
                data: minPieSize(rows)
            }]
        };

        options = $.extend(true, options, config);

        /*
         chart.height: 550,
         chart.width: 550,
         chart.spacingBottom: 130,
         chart.spacingRight: 170
         plotOptions.pie.minSize: 285,
         plotOptions.pie.dataLabels.y: -5
         */

        //Check if there is an overwhelming amount of one stat compared to another
        /*if(getLargestRowPercentage(rows) >= .95) {
            options = $.extend(true, options, {
                chart: {
                    height: 550,
                    width: 550,
                    spacingBottom: 130,
                    spacingRight: 170
                },
                plotOptions: {
                    pie: {
                        minSize: 285,
                        dataLabels: {
                            style: {
                                color: 'black'
                            },
                            distance: 30,
                            y: -5
                        }
                    }
                }
            });
        }*/

        $el.highcharts(options);
    };

    var minPieSize = function(rows) {
        var dataEx = rows,
            len = dataEx.length,
            sum = 0,
            minHeight = .05,
            data = [];

        for (var i = 0; i < len; i++) {
            sum += dataEx[i].y;
        }

        for (var i = 0; i < len; i++) {
            var t = dataEx[i],
                r = t.y / sum;
            data[i] = {
                name: t.name,
                y: ( r > minHeight ? t.y : sum * minHeight ),
                label: t.y,
                redirect: t.redirect,
                color: t.color,
                redirectLink: t.redirectLink
            }
        }
        return data;
    };
    var setGraphSizes = function setGraphSizes($el) {
        $el.find('.graph').each(function(){
            var $this = $(this);

            $this.css('min-height', $this.data('height'));
        });
    };

    var init = function()
    {

        var $dashboardContent = $con.find('.dashboard-content');
        $dashboardContent.each(function() {
            var $tc = $(this);
            var $reportDetail = $('<div class="report-detail"></div>');
            var $reportDetailContent = $('<div class="content"></div>').appendTo($reportDetail);
            var $reportSummary = $tc.find('.reports');
            var activeReportDetail = '';


            var hideReportDetail = function hideReportDetail(callback) {
                $reportDetail.removeClass('active');

                if (typeof callback === "function") callback();
            };

            var showReportDetail = function showReportDetail(callback) {
                $reportDetail.addClass('active');

                if (typeof callback === "function") callback();
            };

            var hideReportSummary = function hideReportSummary(callback) {
                $reportSummary.removeClass('active');

                if (typeof callback === "function") callback();
            };

            var showReportSummary = function showReportSummary(callback) {
                $reportSummary.addClass('active');

                if (typeof callback === "function") callback();
            };

            var showReport = function showReport(reportKey) {
                var reportDetailKeys = [];
                var $template = $('#rpt-'+reportKey);

                if (!$template.length) {
                    return;
                }

                activeReportDetail = reportKey;

                showReportDetail(hideReportSummary);

                $reportDetailContent.addClass('loading');
                $reportDetailContent.html(tmpl($template.get(0).innerHTML));

                reportDetailKeys = $template.data('reportKey');

                setGraphSizes($reportDetailContent);

                getReportData(wsUrl, 'detail', reportDetailKeys, function(result) {
                    if (activeReportDetail == reportKey) {
                        $reportDetailContent.removeClass('loading');
                        drawGraphs($reportDetailContent, result);
                    }
                });
            };

            $tc.on('click', '.report-detail .back', function(evt) {
                evt.preventDefault();
                hideReportDetail(showReportSummary);
            });

            $tc.on('click', '.stat', function(evt) {
                var $stat = $(this).closest('.stat');
                var nextType = $stat.data('nextType');
                var nextResource = $stat.data('nextResource');

                switch (nextType) {
                    case "redirect":
                        redirect(nextResource);
                        break;
                    case "report":
                        showReport(nextResource);
                        break;
                }
            });

            $tc.append($reportDetail);

            if ($reportSummary.data('preload')) {
                drawReports($reportSummary);
            }
        });

        drawReports($dashboardContent.find('.reports'));

//        $con.on('click', '.tab-items li', function(evt) {
//            showTab($(this).index());
//            $(this).addClass('tab-selected').siblings().removeClass('tab-selected');
//        });
//
//        var $selectedTab = $con.find('.tab-items a[href=' + window.location.hash.replace('[^a-zA-Z0-9]+', '') + ']');
//
//        if ($selectedTab.length) {
//            $selectedTab.each(function() {
//                $(this).closest('li').trigger('click');
//            });
//        } else {
//            $con.find('.tab-items li:first').trigger('click');
//        }

    };

    init();

});