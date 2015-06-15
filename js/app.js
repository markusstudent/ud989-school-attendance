


// /* STUDENT APPLICATION */
// $(function() {
//     var attendance = JSON.parse(localStorage.attendance),
//         $allMissed = $('tbody .missed-col'),
//         $allCheckboxes = $('tbody input');

//     // Count a student's missed days
//     function countMissing() {
//         $allMissed.each(function() {
//             var studentRow = $(this).parent('tr'),
//                 dayChecks = $(studentRow).children('td').children('input'),
//                 numMissed = 0;

//             dayChecks.each(function() {
//                 if (!$(this).prop('checked')) {
//                     numMissed++;
//                 }
//             });

//             $(this).text(numMissed);
//         });
//     }

//     // Check boxes, based on attendace records
//     $.each(attendance, function(name, days) {
//         var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
//             dayChecks = $(studentRow).children('.attend-col').children('input');

//         dayChecks.each(function(i) {
//             $(this).prop('checked', days[i]);
//         });
//     });

//     // When a checkbox is clicked, update localStorage
//     $allCheckboxes.on('click', function() {
//         var studentRows = $('tbody .student'),
//             newAttendance = {};

//         studentRows.each(function() {
//             var name = $(this).children('.name-col').text(),
//                 $allCheckboxes = $(this).children('td').children('input');

//             newAttendance[name] = [];

//             $allCheckboxes.each(function() {
//                 newAttendance[name].push($(this).prop('checked'));
//             });
//         });

//         countMissing();
//         localStorage.attendance = JSON.stringify(newAttendance);
//     });

//     countMissing();
// }());




//My functions

var model = {
    columns: {
        labelFirstColumn : "Student Name",
        numberOfDays : 12,
        labelLastColumn: "Days Missed-col"
    },
    students: [
        {
            id : 0,
            name : "Slappy the Frog",
            daysMissing: 0
        },
        {
            id : 1,
            name : "Lilly the Lizard",
            daysMissing: 0
        },
        {
            id : 2,
            name : "Paulrus the Walrus",
            daysMissing: 0
        },
        {
            id : 3,
            name : "Gregory the Goat",
            daysMissing: 0
        },
        {
            id : 4,
            name : "Adam the Anaconda",
            daysMissing: 0
        },
    ]
};

var controller = {

    init: function (){

        view.init();
        controller.writeAttendance();
        controller.countDaysMissing();
        controller.updateLocalStorageIfCheckboxIsClicked();
        view.checkCheckboxes();

    },

    getColumns: function() {
        return model.columns;
    },

    getStudents: function() {
        return model.students;
    },

    writeAttendance: function() {
        if (!localStorage.attendance) {
            console.log('Creating attendance records...');
            function getRandom() {
                return (Math.random() >= 0.5);
            }

            attendance = {};

            for (var i = 0; i < controller.getStudents().length; i++) {

                var name = controller.getStudents()[i].name;

                attendance[name] = [];

                for (var z = 1; z <= controller.getColumns().numberOfDays; z++) {
                    attendance[name].push(getRandom());
                };
            };

            localStorage.attendance = JSON.stringify(attendance);
            
        }
    },

    countDaysMissing: function() {

        //count from localStorage how many days a student was missing
        
        var retrievedAttendance = JSON.parse(localStorage.attendance);

        $.each(retrievedAttendance, function(studentName, dayArray){

            var numDaysMissed = 0;

            for (i = 0; i < dayArray.length; i++) {

                if (dayArray[i] == false) {
                    numDaysMissed ++;
                }
            };

            $.each(model.students, function(){
                if (this.name == studentName) {
                    this.daysMissing = numDaysMissed;
                }
            });

        });

        view.writeDaysMissing();

    },

    updateLocalStorageIfCheckboxIsClicked: function(){
    
        var $allCheckboxes = $('tbody input');

        // When a checkbox is clicked, update localStorage
        $allCheckboxes.on('click', function() {
            var studentRows = $('tbody .student'),
                newAttendance = {};

            studentRows.each(function() {
                var name = $(this).children('.name-col').text(),
                    $allCheckboxes = $(this).children('td').children('input');

                newAttendance[name] = [];

                $allCheckboxes.each(function() {
                    newAttendance[name].push($(this).prop('checked'));
                });
            });

            localStorage.attendance = JSON.stringify(newAttendance);
            controller.countDaysMissing();

        });
    }

};

var view = {

    init: function (){

        view.createTable();

    },

    createTable : function() {

        var tableHeadColums = '';

        for (i=1; i<= controller.getColumns().numberOfDays; i++){
            tableHeadColums += '<th>' + i + '</th>'
        };

        var tableHead = '<thead><tr><th class="name-col">Student Name</th>' + tableHeadColums + '<th class="missed-col">Days Missed-col</th></thead>';

        var tableBodyCheckboxes = '';

        for (i=1; i<= controller.getColumns().numberOfDays; i++) {
            tableBodyCheckboxes += '<td class="attend-col"><input type="checkbox"></td>'
        };

        var tableBody = '';

        controller.getStudents().forEach(function(student){
            tableBody += '<tr class="student"><td class="name-col">' + student.name + '</td>' + tableBodyCheckboxes + '<td class="missed-col">0</td></tr>'
        });

        var table = '<table>' + tableHead + '<tbody>' +  tableBody + '</tbody></table>';

        $('#table').append(table);

    },

    checkCheckboxes: function() {

        var retrievedAttendance = JSON.parse(localStorage.attendance);

        $.each(retrievedAttendance, function(name,days){

            var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                dayChecks = $(studentRow).children('.attend-col').children('input');

            dayChecks.each(function(i) {
                $(this).prop('checked', days[i]);
            }); 
        });

    },

    writeDaysMissing : function() {

        var students = controller.getStudents();

        $.each(students, function(){

            var studName = this.name;

            var studentRow = $('tbody .name-col:contains("' + studName + '")').parent('tr');

            $(studentRow).children('.missed-col').text(this.daysMissing);

        });

    }

};


controller.init();


