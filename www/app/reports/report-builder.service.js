//
// Report Service
//
// This service provides factories for the core type [Course] and for (3) lookup
// types: [SubjectType], [TermType], [GradeType].  There is a "main" service [CourseSvc]
// that injects all (4) types.  The service keeps an array of each lookup type as well
// as an array of courses for the current transcript.  The CourseSvc is used by the controller
// for managing courses.  Class methods on the [Course] type are use for CRUD operations. 
(function() {
    'use strict';
    // attach the factories and service to the [starter.services] module in angular
    angular.module('app.reports')
        .service('ReportBuilderSvc', ['ReportMock', reportBuilderService]);
    
	function reportBuilderService(ReportMock) {
        var self = this;
		var currentDate = new Date();

		self.generateReport = _generateReport;
            
        function _generateReport(t) {
//			var pageTitle = this.prospect.firstName.substring(0,1) + '.';
//			pageTitle += this.prospect.lastName + ' - ';
//			pageTitle += this.prospect.transcriptTitle;
//			var dd = {
//				content: [
//					reportHeader(pageTitle, false), 
//					reportProspect( this.prospect ),
//					reportProgress( this.progress, this.testMatrix ), 
//					reportChecklist( this.checklist ), 
//					reportHeader(pageTitle, true), 
////					reportCourselist(this.categoricalCourses),
//                    reportCoreChecklist(this.coreChecklist)
//				],
//				pageSize: 'letter',
//				styles:  reportStyles()
//			}
//			return dd;	
            return ReportMock.processTrip(t);
//			return ReportMock.docDef;
		};

        function reportHeader(data, showLine) {
            var header = [{table: {
                widths: [78,364,78],
                body: [
                        [ { image: logoSvc.ucla, height: 36, width: 72, alignment:'center' }, 
                        [ { 
                            text: 'NCAA Eligibility Analysis', 
                            color: '#036',
                            style: 'header' 
                        },
                        { 
                            text: data, 
                            color: '#555',
                            style: 'header' 
                        } ],
                        { image: logoSvc.ucla, height: 36, width: 72, alignment:'center' }
                ]
                ] }, layout: 'noBorders' } ];
            if (showLine) {
                header.push( {
                    canvas: [{type: 'line',
                    x1: 0, y1: 0,
                    x2: 520, y2:0
                    }],
                    margin: [ 0, 4, 0, 4]
                } );
            };

            return header;
        }
        }

        function reportStyles() {
            var styles = {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center'
                },
                subheader: {
                    fontSize: 15,
                    bold: true
                },
                quote: {
                    italics: true
                },
                small: {
                    fontSize: 8
                },
                tableExample: {
                    alignment: 'center', 
                    margin: [0, 4, 0, 8]
                },
                tableCourseList: {
                    fontSize: 10,
                    padding: [4,0,4,0]
                },
                tableHeader: {
                    alignment:'center',
                    bold: true,
                    fontSize: 13,
                    fillColor: '#06b',
                    color: 'white'
                },
                categoryHeader: {
                    alignment:'center',
                    bold: true,
                    fontSize: 13,
                    fillColor: 'red',
                    color: 'white'
                }
            };

            return styles;
        }

        function sectionHeader(data) {
            var header = [{
                    text: data.title,
                    style: 'subheader'
                },
                {canvas: [{type: 'line',
                    x1: 0, y1: 0,
                    x2: 512, y2:0
                    }],
                    margin: [ 0, 4, 0, 3]
                }];

            return header;
        }

        function reportProspect(data) {
            var prospect = [
                sectionHeader( { title:'Prospect Details' } ),
                {
                    columns: [
                        {
                            style: 'tableExample',
                            table: {
                                    widths: [75,150],
                                    body: [
                                            [ { text:'Highschool:', alignment: 'right', bold:true, color:'#057' }, 
                                                { text:data.highschool, alignment: 'left' } ],
                                            [ { text:'Hometown:', alignment: 'right', bold:true, color:'#057' }, 
                                                { text:data.hometown, alignment: 'left' } ],
                                            [ { text:'Grad year:', alignment: 'right', bold:true, color:'#057' }, 
                                                { text:data.gradyr, alignment: 'left' } ]
                                    ]
                            },
                            layout: 'lightHorizontalLines'
                        },
                        {
                            style: 'tableExample',
                            table: {
                                widths: [75,150],
                                body: [
                                        [ { text:'Coach:', alignment: 'right', bold:true, color:'#057' }, 
                                            { text:data.coach, alignment: 'left' } ],
                                        [ { text:'Counselor:', alignment: 'right', bold:true, color:'#057' }, 
                                            { text:data.counselor, alignment: 'left' } ],
                                        [ { text:'Report Run:', alignment: 'right', bold:true, color:'#057' }, 
                                            { text:data.timestamp, alignment: 'left' } ]
                                ]
                            },
                            layout: 'lightHorizontalLines'
                        }
                    ]
                }];

            return prospect;
        }

        function reportProgress(progress, testMatrix) {
            function testTableBody(testMatrix) {
                var testRows = [];
                testRows.push( [{ text: 'SAT', style: 'tableHeader' }, 
                                { text: 'ACT', style: 'tableHeader' }, 
                                { text: 'GPA', style: 'tableHeader' }] );
                for (var i = 0; i < testMatrix.length; i++) {
                    var testRow = [];
                    var fillColor = (i==2) ? 'yellow' : 'white';
                    testRow.push( { text: testMatrix[i].SAT.toString(), alignment: 'center', fillColor: fillColor } );
                    testRow.push( { text: testMatrix[i].ACT.toString(), alignment: 'center', fillColor: fillColor } );
                    testRow.push( { text: testMatrix[i].GPA.toFixed(3), alignment: 'center', fillColor: fillColor } );
                    testRows.push( testRow );
                }
                return testRows;
            }

            var completionAngle = Math.ceil(360 * (parseFloat(progress.units) / 16.0));

            var progress = [
                sectionHeader( { title:'Unit Progress and Test Matrix' } ),
                {
                    alignment: 'justify',
                    columns: [
                        { stack: [
                            { text:'Cumulatuve Units Completed', alignment: 'center', color: 'blue' }, 
                            {
                            canvas: [
                                {
                                    type: 'path',
                                    x: 122,
                                    y: 82,
                                    r: 77,
                                    a1: 0,
                                    a2: completionAngle,
                                    lineColor: 'white',
                                    color: '#06b'
                                }, {
                                    type: 'path',
                                    x: 122,
                                    y: 82,
                                    r: 77,
                                    a1: completionAngle,
                                    a2: 360,
                                    lineColor: 'white',
                                    color: '#09b'
                                }
                                ]
                        } ] },
                        [
                            {
                                style: 'tableExample',
                                table: {
                                        headerRows: 1,
                                        // keepWithHeaderRows: 1,
                                        // dontBreakRows: true,
                                        widths: [ 70, 70, 70 ],
                                        body: [
                                                [{ text: 'Units', style: 'tableHeader' }, 
                                                    { text: 'GPA', style: 'tableHeader' }, 
                                                    { text: 'Points', style: 'tableHeader' }],
                                                [
                                                    { text: progress.units, alignment: 'center', fillColor:'yellow' }, 
                                                    { text: progress.GPA, alignment: 'center', fillColor:'yellow' }, 
                                                    { text: progress.qpoints, alignment: 'center', fillColor:'yellow' } 
                                                ]
                                        ]
                                }
                            },
                            {
                                style: 'tableExample',
                                table: {
                                        headerRows: 1,
                                        // keepWithHeaderRows: 1,
                                        // dontBreakRows: true,
                                        widths: [ 70, 70, 70 ],
                                        body: [
                                                [{ text: 'SAT', style: 'tableHeader' }, 
                                                { text: 'ACT', style: 'tableHeader' }, 
                                                { text: 'GPA', style: 'tableHeader' }],
                                                [
                                                    { text: '570' }, 
                                                    { text: '3.142', alignment: 'center' }, 
                                                    { text: '38.7', alignment: 'center' } 
                                                ],
                                                [
                                                    { text: '620', alignment: 'center' }, 
                                                    { text: '3.142', alignment: 'center' }, 
                                                    { text: '38.7', alignment: 'center' } 
                                                ],										
                                                [
                                                    { text: '670', alignment: 'center' }, 
                                                    { text: '3.142', alignment: 'center' }, 
                                                    { text: '38.7', alignment: 'center' } 
                                                ],
                                                [
                                                    { text: '720', alignment: 'center' }, 
                                                    { text: '3.142', alignment: 'center' }, 
                                                    { text: '38.7', alignment: 'center' } 
                                                ],
                                                [
                                                    { text: '770', alignment: 'center' }, 
                                                    { text: '3.142', alignment: 'center' }, 
                                                    { text: '38.7', alignment: 'center' } 
                                                ]
                                        ]
                                }
                            }
                        ]
                    ]
                },
                { 
                    text: 'The test matrix shows the required test score to qualify with the current cumulative GPA.  The rows above and below show the requirted graduating GPA for test scores -100/-50/+50/+100 points adjusted from the centerline.  Use this matrix as a guide for how a changing test score can shift the requried graduating GPA.', 
                    style: ['quote', 'small'] 
                }];
            var sample = testTableBody( testMatrix );
            progress[1].columns[1][1].table.body = sample;
            return progress;
        }

        function reportChecklist(data) {
            var barWidth = 330;
            var checklist = [
                sectionHeader( { title:'Categorical Core Check Analysis' } ),
                {
                    table: {
                        headers: 1,
                        widths: [ 75, barWidth, 50],
                        body: [
                            [{ text: 'Category', style:'tableHeader'}, 
                                { text: ' ', style:'tableHeader'}, 
                                { text: 'Progress', style:'tableHeader'}], 
                            [{ text: 'English', alignment: 'center' }, { canvas: [{
                                type: 'rect',
                                x: -2,
                                y: 0,
                                w: (barWidth * data.english / 100).toFixed(0),
                                h: 20,
                                color: '#09b'}]}
                                , { text: data.english.toFixed(0) + '%', alignment: 'center' }],
                            [{ text: 'Math', alignment: 'center' }, { canvas: [{
                                type: 'rect',
                                x: -2,
                                y: 0,
                                w: ( barWidth * data.math / 100 ).toFixed(0),
                                h: 20,
                                color: '#069'}]}
                                , { text: data.math.toFixed(0) + '%', alignment: 'center' }],
                            [{ text: 'Science', alignment: 'center' }, { canvas: [{
                                type: 'rect',
                                x: -2,
                                y: 0,
                                w: ( barWidth * data.science / 100).toFixed(0),
                                h: 20,
                                color: '#09b'}]}
                                , { text: data.science.toFixed(0) + '%', alignment: 'center' }],
                            [{ text: 'Core', alignment: 'center' }, { canvas: [{
                                type: 'rect',
                                x: -2,
                                y: 0,
                                w: ( barWidth * data.core / 100).toFixed(0),
                                h: 20,
                                color: '#069'}]}
                                , { text: data.core.toFixed(0) + '%', alignment: 'center' }],
                            [{ text: 'Soc Sci', alignment: 'center' }, { canvas: [{
                                type: 'rect',
                                x: -2,
                                y: 0,
                                w: ( barWidth * data.socsci / 100 ).toFixed(0),
                                h: 20,
                                color: '#09b'}]}
                                , { text: data.socsci.toFixed(0) + '%', alignment: 'center' }],
                            [{ text: 'Elective', alignment: 'center' }, { canvas: [{
                                type: 'rect',
                                x: -2,
                                y: 0,
                                w: ( barWidth * data.elective / 100 ).toFixed(0),
                                h: 20,
                                color: '#069'}]}
                                , { text: data.elective.toFixed(0) + '%', alignment: 'center' }]
                        ]
                    }, 
                    pageBreak: 'after'
                }];

            return checklist;
        }

        function reportCourselist(categoricalCourses) {
            function categoryCourselist(category) {
                var courses = [];
                courses.push([{text:category.Title, style: 'tableHeader', colSpan:4, fontSize: 11}]);
                var courselist = categoricalCourses[category.Name];
                for (var i = 0; i < courselist.length; i++) {
                    var course = courselist[i];
                    var courseRow = [];
                    if( course && course !== "null" && course !== "undefined" ) {
                        courseRow.push( { text: course.Title } );
                        courseRow.push( { text: course.Term.Units.toFixed(1) } );
                        courseRow.push( { text: course.Grade.LetterGrade } );
                        courseRow.push( { text: (course.Grade.QualityPoints * course.Term.Units).toFixed(1) } );
                    }
                    courses.push(courseRow);
                }
                courses.push([{text:' '},{text:' '},{text:' '},{text:' '}]);
                return courses;
            }

            var courselist = [{
                    style: 'tableCourseList', 
                    layout: {
                        hLineWidth: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? 2 : 1;
                        },
                        vLineWidth: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                        },
                        hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                        },
                        vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                        },
                         paddingTop: function(i, node) { return 1; },
                         paddingBottom: function(i, node) { return 1; }
                    },
                    table: {
                        headers: 1,
                        widths: [300, 60, 60, 60],
                        body: [
                            [{ text: 'Course Title', style: 'tableHeader', fontSize: 11}, 
                                { text: 'Units', style: 'tableHeader', fontSize: 11}, 
                                { text: 'Grade', style: 'tableHeader', fontSize: 11}, 
                                { text: 'Points', style: 'tableHeader', fontSize: 11}]
                            ]
                    }
                }];
            var categories = ['English', 'Math', 'Science', 'Social Science', 'Other'];
            for (var i = 0; i < categories.length; i++) {		
                var category = categories[i];
                var categoryCourses = categoricalCourses[category];
                if ( categoryCourses && categoryCourses !== "null" && categoryCourses !== "undefined" ) {
                    var cat = { Title:category + ' Courses', Name:category };
                    var body = courselist[0].table.body;
                    courselist[0].table.body = body.concat( categoryCourselist(cat) );
                }
            }	
            return courselist;
        }	


        function reportCoreChecklist(checklist) {
            //create the courselist table header to start
            var courselist = [{
                    style: 'tableCourseList', 
                    layout: {
                        hLineWidth: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? 2 : 1;
                        },
                        vLineWidth: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                        },
                        hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                        },
                        vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                        },
                         paddingTop: function(i, node) { return 1; },
                         paddingBottom: function(i, node) { return 1; }
                    },
                    table: {
                        headers: 1,
                        widths: [300, 60, 60, 60],
                        body: [
                            [{ text: 'Course Title', style: 'tableHeader', fontSize: 11}, 
                                { text: 'Units', style: 'tableHeader', fontSize: 11}, 
                                { text: 'Grade', style: 'tableHeader', fontSize: 11}, 
                                { text: 'Points', style: 'tableHeader', fontSize: 11}]
                            ]
                    }
                }];
            
            checklist.forEach(function(reqChk) {
                var req = reqChk.req;
                var category = reqChk.title;
                if (reqChk.courses.length > 0) {
                    var cat = { Title: reqChk.title + ' Courses', Name: reqChk.title };
                    var body = courselist[0].table.body;
                    courselist[0].table.body = body.concat( _categoryCourselist(reqChk) );
                }
            });
            return courselist;

            function _categoryCourselist(reqChk) {
                var courses = [];
                courses.push([{text:reqChk.title + ' Category Courses', style: 'tableHeader', colSpan:4, fontSize: 11}]);
                var courselist = reqChk.courses;
                for (var i = 0; i < courselist.length; i++) {
                    var course = courselist[i];
                    var courseRow = [];
                    if( course && course !== "null" && course !== "undefined" ) {
						var rowColor = (course.Grade.LetterGrade == 'WiP') ? 'blue' : 'black';
						var gradePts = (course.Grade.QualityPoints * course.Term.Units).toFixed(1);
                        courseRow.push( { text: course.Title, color:rowColor } );
                        courseRow.push( { text: course.Term.Units.toFixed(1), color:rowColor } );
                        courseRow.push( { text: course.Grade.LetterGrade, color:rowColor } );
                        courseRow.push( { text: gradePts, color:rowColor } );
                    }
                    courses.push(courseRow);
                }
                //check for any remaining units required
                var emptyCount = (reqChk.req.requiredUnits - reqChk.units) * 2.0;
                for (var j = 0 ; j < emptyCount; j++) {
                    courses.push([{text:' ',fillColor:'#ffa'},{text:' ',fillColor:'#ffa'},{text:' ',fillColor:'#ffa'},{text:' ',fillColor:'#ffa'}]);
                }
                return courses;
            }
        }	
})();