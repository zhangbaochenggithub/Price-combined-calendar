//日历-周
$(function () {
    var c1 = new Calendar();
    var l1 = new setLodaDateSwrap()
    var step = 7; // 单位:天,7天切换一次

    // 时间范围
    var dataRange = {
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment(moment().add(1, 'month')).format('YYYY-MM-DD')
    }
    var startDate = dataRange.startDate; // 初始日期
    var endDate = moment(moment(startDate).add(step, 'days')).format('YYYY-MM-DD'); // 当天往后推13天加上今天一共14天,正好是UL父元素的2倍
    var defaultSelectDate = dataRange.startDate;
    // 初始化
    var CalendarInfo = getDateData(startDate, endDate, defaultSelectDate);
    $('.current-period ul').html(setHtml(CalendarInfo)); //填充日历到页面,并且设置价格

    l1.init('.calendar_week', {
        // step: step,
        Calendar: '#current-ul',
        prev: '.previous-period',
        next: '.after-period',
        //前一周
        prevClick: function (callback) {
            // 停止滚动:prevBtnIsDisabled()方法自己定义,如果返回false,就代表此按钮置灰,
            // if (!prevBtnIsDisabled()) {return false;}
            if (callback) {
                callback(function () {
                    startDate = (moment(startDate).add(-step, 'day')).format('YYYY-MM-DD');
                    endDate = moment(moment(startDate).add(step, 'days')).format('YYYY-MM-DD');

                    var dateJson = localStorage.getItem('dateJsons') ? JSON.parse(localStorage.getItem('dateJsons')) : [];
                    CalendarInfo = getDateData(startDate, endDate, defaultSelectDate); // 日历数据--没有价格
                    $('.current-period ul').html(setHtml(CalendarInfo, dateJson));// 给日历添加价格
                })
            }
            return true;
        },
        //后一周
        nextClick: function (callback) {
            // 停止滚动:nextBtnIsDisabled(),方法自己定义,如果返回false,就代表此按钮置灰
            // if (!nextBtnIsDisabled()) {return false; }
            if (callback) {
                callback(function () {
                    startDate = (moment(startDate).add(step, 'day')).format('YYYY-MM-DD');
                    endDate = moment(moment(startDate).add(step, 'days')).format('YYYY-MM-DD');

                    CalendarInfo = getDateData(startDate, endDate, defaultSelectDate); // 日历数据--没有价格
                    var dateJson = localStorage.getItem('dateJsons') ? JSON.parse(localStorage.getItem('dateJsons')) : [];
                    $('.current-period ul').html(setHtml(CalendarInfo, dateJson));// 给日历添加价格
                })
            }
            return true;
        },
    });

    //单独日点击
    $(document).on('click', '.current-ul li', function () {
        var that = this;
        $(this).addClass('s_curday').siblings('li').removeClass('s_curday');
        defaultSelectDate = $(this).attr('date'); //

        setTimeout(function () {
            var dateJsons = [];
            if (localStorage.getItem('dateJsons')) {
                dateJsons = JSON.parse(localStorage.getItem('dateJsons'))
            }
            var item = {
                "date": $(that).attr('date'),
                "price": 200
            }
            dateJsons.push(item);
            localStorage.setItem('dateJsons', JSON.stringify(dateJsons))
            $(that).find('.default').html(item.price);
        }, 2000)
    })


    //拼接页面
    function setHtml(CalendarInfo, priceJson) {
        var html = ''
        console.log(CalendarInfo)
        // console.log(priceJson)
        for (var key in CalendarInfo) {
            for (var i = 0; i < CalendarInfo[key].date.length; i++) {
                var items = CalendarInfo[key].date[i];
                if (items.classname && items.daytype == 's_day') {
                    if (priceJson && priceJson.length) {
                        for (var j = 0; j < priceJson.length; j++) {
                            if (moment(items.date).format('YYYY-MM-DD') == moment(priceJson[j].date).format('YYYY-MM-DD')) {
                                items.addPrice = priceJson[j].price;
                                break;
                            }
                        }
                    }
                    var price = items.addPrice ? items.addPrice : '无船期';
                    html += '<li class="dayprice ' + items.classname + '" date="' + items.date + '" riqi="' + items.week + '">\n' +
                        '                <div class="calendar-weekday" date="2019/11/20"><span>' + moment(items.date).format('MM-DD') + '</span><span> 周' + c1.setWeek(items.week) + '</span></div>\n'
                    if (items.addPrice) {
                        if (true) {
                            html += '<div class="calendar-price"><span class="price_units">$</span><span class="default">' + price + '</span></div>' +
                                '<div class="floor_price"></div></li>'
                        } else {
                            html += '<div class="calendar-price"><span class="price_units">$</span><span class="default">' + price + '</span></div>\n</li>'
                        }

                    } else {
                        html += '<div class="calendar-price"><span class="default">' + price + '</span>\n'
                    }
                }
            }
        }

        return html + html;
    }

    //返回从今天开始的日历
    function getDateData(startDate, endDate, defaultSelectDate) {
        return c1.init({ startDate: startDate, endDate: endDate, defaultSelectDate: [defaultSelectDate] }); // 日期数据
    }

})




//日历-月
$(function () {
    var c1 = new Calendar();
    var l1 = new setLodaDateSwrap();

    // 时间范围
    // var dataRange = {
    //     startDate: $('#start').val(),// moment().format('YYYY-MM-DD'),
    //     endDate: $('#end').val()// moment(moment().add(4, 'month')).format('YYYY-MM-DD') // 往后推4个月,加上当前月份,一共显示5个月份
    // }
    // var startDate = dataRange.startDate; //moment(moment(dataRange.startDate).add(5, 'days')).format('YYYY-MM-DD'); // 初始日期
    // var endDate = moment(dataRange.startDate).format('YYYY-MM') == moment(dataRange.endDate).format('YYYY-MM') ? dataRange.endDate : moment(startDate).endOf('month').format('YYYY-MM-DD');  // 初始日期
    // var defaultSelectDate =$('#current').val(); // 默认选中的日期

    var dataRange = { startDate: '', endDate: '' }, startDate = '', endDate = '', defaultSelectDate = ''; // 全局变量


    // 初始化
    var dateJson = localStorage.getItem('dateJsons') ? JSON.parse(localStorage.getItem('dateJsons')) : [];
    l1.init('.price-calendar', {
        Calendar: '#tableCalendar',
        prev: '.last-month',
        next: '.next-month',

        //上一个月
        prevClick: function (callback) {
            debugger
            if (!prevBtnIsDisabled()) {
                return false;
            }

            if (callback) {
                callback(function () {
                    var dateJson = localStorage.getItem('dateJsons') ? JSON.parse(localStorage.getItem('dateJsons')) : [];
                    CalendarInfo = getDateData(startDate, endDate, defaultSelectDate); // 日历数据--没有价格
                    $('#tableCalendar').html(setHtml(CalendarInfo, dateJson));// 给日历添加价格
                })
            }
            return true;
        },

        //下一个月
        nextClick: function (callback) {
            if (!nextBtnIsDisabled()) {
                return false;
            }
            if (callback) {
                callback(function () {
                    CalendarInfo = getDateData(startDate, endDate, defaultSelectDate); // 日历数据--没有价格
                    var dateJson = localStorage.getItem('dateJsons') ? JSON.parse(localStorage.getItem('dateJsons')) : [];
                    $('#tableCalendar').html(setHtml(CalendarInfo, dateJson));// 给日历添加价格
                })
            }
            return true;
        }
    });

    //日历显示
    $('#date_month').on('click', function () {
        $('#dCalendar').show();
        $('#date-price').show();
        dataRange = {
            startDate: moment().format('YYYY-MM-DD'),
            endDate: ''// moment(moment().add(4, 'month')).format('YYYY-MM-DD') // 往后推4个月,加上当前月份,一共显示5个月份
        }
        startDate = dataRange.startDate; //moment(moment(dataRange.startDate).add(5, 'days')).format('YYYY-MM-DD'); // 初始日期
        endDate = moment(dataRange.startDate).format('YYYY-MM') == moment(dataRange.endDate).format('YYYY-MM') ? dataRange.endDate : moment(startDate).endOf('month').format('YYYY-MM-DD');  // 初始日期
        defaultSelectDate = $('#current').val();
        var CalendarInfo = getDateData(startDate, endDate, defaultSelectDate); //获取日历
        $('#tableCalendar').html(setHtml(CalendarInfo, dateJson)); //填充日历到页面,并且设置价格
    })

    $('#close').on('click', function () {
        $('#date-price').hide();
    })

    //每个日期点击
    $(document).on('click', '#tableCalendar li', function () {
        if (!$(this).hasClass("s_pass")) {
            var that = this;
            $(this).addClass('s_curday').siblings('li').removeClass('s_curday');
            defaultSelectDate = $(this).attr('date'); //
            console.log(defaultSelectDate)
            $('#current').val(defaultSelectDate);
            setTimeout(function () {
                var dateJsons = [];
                if (localStorage.getItem('dateJsons')) {
                    dateJsons = JSON.parse(localStorage.getItem('dateJsons'))
                }
                var item = {
                    "date": $(that).attr('date'),
                    "price": 200,
                    discount: '折'
                }
                dateJsons.push(item);
                localStorage.setItem('dateJsons', JSON.stringify(dateJsons));
                $(that).find('.price').addClass("price_red").html('$' + item.price);
            }, 2000)
        }
    })

    //拼接页面
    function setHtml(CalendarInfo, priceJson) {
        var keyArr = Object.keys(CalendarInfo); //讲对象转化成数组,然后取索引
        var CalendarInfo0 = CalendarInfo[keyArr[0]];
        $('.minprice-month').html(CalendarInfo0.title);

        // console.log(CalendarInfo)

        // 获取下个月的日期
        var nextInfo = c1.init({
            startDate: moment(startDate).add(1, 'month').format('YYYY-MM-DD'),
            endDate: moment(startDate).add(1, 'month').endOf('month').format('YYYY-MM-DD')
        });

        var html = '<ul  date="2019/7">';
        for (var i = 0; i < CalendarInfo[keyArr[0]].date.length; i++) {
            var items = CalendarInfo[keyArr[0]].date[i];
            // var tags = '';
            if (items.classname) {
                if (priceJson && priceJson.length) {
                    for (var j = 0; j < priceJson.length; j++) {
                        if (moment(items.date).format('YYYY-MM-DD') == moment(priceJson[j].date).format('YYYY-MM-DD')) {
                            items.addPrice = priceJson[j].price;
                            // for (var k in priceJson[j]) {
                            //     if (k != 'date' && k != 'price') {
                            //         tags += '<span class="' + k + '">' + priceJson[j][k] + '</span> ';
                            //     }
                            // }
                            break;
                        }
                    }
                }
                // var price = items.addPrice ? items.addPrice : '无船期';


                // console.log(tags)
                html += '<li class="date ' + items.classname + '" date="' + items.date + '" riqi="' + items.week + '">' +
                    '<div class="day">' + items.day + '</div>'

                if (items.addPrice) {
                    if (true) {
                        html += '<div class="price price_red">$' + items.addPrice + '<div class="floor_price"></div></div></li>'
                    } else {
                        html += '<div class="price price_red">$' + items.addPrice + '</div></li>'
                    }
                } else {
                    html += '<div class="price">无船期</div></li>'
                }

            } else {
                html += '<li class="date">' +
                    '<div class="day"></div>' +
                    '<div class="price"></div>' +
                    '</li>'
            }
        }
        var nextInfoKeyArr = Object.keys(nextInfo); //讲对象转化成数组,然后取索引
        // 获取下一个月最前面空格有几个,
        var afterPassNumber = 0;
        for (var i = 0; i < nextInfo[nextInfoKeyArr[0]].date.length; i++) {
            if (!nextInfo[nextInfoKeyArr[0]].date[i].classname) {
                afterPassNumber++;
            }
        }
        if (afterPassNumber > 0) {
            // 如果大于0个的话,就用7减一下
            for (var i = 0; i < (7 - afterPassNumber); i++) {
                html += '<li class="date">' +
                    '                            <div class="day"></div>' +
                    '                            <div class="price"></div>' +
                    '                        </li>'
            }
        }
        html += '</ul>';

        return html + html;
    }

    function nextBtnIsDisabled() {
        var a = moment(endDate); // 切换的最后一天
        var b = moment(dataRange.endDate); // 设置的截止时间
        if (moment(a).diff(b) >= 0) {
            endDate = dataRange.endDate
            startDate = moment(endDate).startOf('month').format('YYYY-MM-DD');
            return false;
        }
        startDate = moment(startDate).add(1, 'month').startOf('month').format('YYYY-MM-DD');
        if (moment(endDate).add(1, 'month').format('YYYY-MM') == moment(dataRange.endDate).format('YYYY-MM')) {
            endDate = dataRange.endDate;
        } else {
            endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
        }
        return true;
    }

    function prevBtnIsDisabled() {
        var a = moment(startDate); // 切换的第一天
        var b = moment(dataRange.startDate); // 设置的开始时间
        if (moment(b).diff(a) >= 0) {
            startDate = dataRange.startDate;
            endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
            return false;
        }
        if (moment(startDate).add(-1, 'month').format('YYYY-MM') == moment(dataRange.startDate).format('YYYY-MM')) {
            startDate = dataRange.startDate;
        } else {
            startDate = (moment(startDate).add(-1, 'month')).startOf('month').format('YYYY-MM-DD');
        }
        endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
        return true;
    }


    function getDateData(startDate, endDate, defaultSelectDate) {
        return c1.init({ startDate: startDate, endDate: endDate, defaultSelectDate: [defaultSelectDate] });
    }

})