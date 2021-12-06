const VOWEL_GRADES=["A","A-","A+","F"];const COLUMN={INFORMATION:"information",REVIEW:"review",STATUS:"status",PROFESSOR:"professor",VERIFY:"verify"}
function ratingToElement(rating){ratingHtml='<span class="rating">';for(i=0;i<rating;i++){ratingHtml+=`<i style="margin-top:4px;" class="fas fa-star"></i>\n`;ratingHtml+=`<i class="far fa-star"></i>\n`}
for(i=rating;i<5;i++){ratingHtml+=`<i class="far fa-star"></i>\n`;}
ratingHtml+=`</span> <br />`;return ratingHtml;}
function gradeToElement(grade){a_str=(VOWEL_GRADES.indexOf(grade)!=-1)?"an":"a"
return `Expecting ${a_str} ${grade} <br />`;}
function generateTable(reviews,targetId,columns,hiddenReviews=[]){let tableHtml=`
    <table class="table reviews-table">
        <thead>
    `
for(let column of columns){switch(column){case COLUMN.INFORMATION:tableHtml+=`<th scope="col" class="review-table-information">Information</th>`
break;case COLUMN.REVIEW:tableHtml+=`<th scope="col" class="review-table-review">Review</th>`
break;case COLUMN.PROFESSOR:tableHtml+=`<th scope="col" class="review-table-professor">Professor</th>`
break;case COLUMN.STATUS:tableHtml+=`<th scope="col" class="review-table-status">Status</th>`
break;case COLUMN.VERIFY:tableHtml+=`<th scope="col" class="review-table-verify">Verify</th>`
break;}}
tableHtml+=`
        </thead>
        <tbody>
    `
for(let review of reviews){if(hiddenReviews.includes(review.id)){tableHtml+=`<tr id="${review.id}" style="display: none;">`;}else{tableHtml+=`<tr id="${review.id}">`;}
for(let column of columns){switch(column){case COLUMN.INFORMATION:tableHtml+=`<td style="white-space: nowrap;">`;if(review.slug){tableHtml+=`<span><a href="/professor/${review.slug}"><strong>${review.name}</strong></a></span> <br />`;}
else if(review.name!=null){tableHtml+=`<span><strong>${review.name}</strong></span> <br />`;}
if(review.department){tableHtml+=`<span class="course"><a href="/course/${review.department+review.course_number}">${review.department+review.course_number}</a></span><br />`;}
else{tableHtml+=`<span class="course"></span>`;}
tableHtml+=`${ratingToElement(review.rating)}`;if(review.expected_grade){tableHtml+=`${gradeToElement(review.expected_grade)}`;}
tableHtml+=`
                        ${review.reviewer_name}
                        <br />
                        ${review.created}
                    `;if(review.from_ourumd){tableHtml+=` <i class="fas fa-info-circle" data-toggle="tooltip" data-placement="right" title="This review was automatically imported from OurUMD. It was not verified by our review checkers. It may not follow our review standards."></i>`;}
var parts=review.created.split('/');var reviewCreated=new Date(parts[2],parts[0],parts[1]);if(reviewCreated>=new Date(2020,3,10)&&reviewCreated<=new Date(2021,8,30)){tableHtml+=` <i class="fas fa-head-side-mask" data-toggle="tooltip" data-placement="right" title="This review was submitted while most classes were online during the COVID-19 pandemic. The review may not be indicative of a regular semester."></i>`;}
tableHtml+="</td>";break;case COLUMN.REVIEW:tableHtml+=`<td style="white-space: pre-line;">${review.review}</td>`;break;case COLUMN.PROFESSOR:tableHtml+=`
                    <td>
                        <strong><a href="/professor/${review.slug}">${review.name}</a></strong>
                    </td>
                    `
break;case COLUMN.STATUS:tableHtml+=`<td>`;if(review.review_verified==0){tableHtml+=`<p style="color: darkgoldenrod;">Under Review</p>`}
else if(review.review_verified==-1){tableHtml+=`
                        <p style="color: red; display: inline;">Rejected</p>
                        <i class="fas fa-info-circle" data-toggle="tooltip" data-placement="right" title="Check the about page to see our standards for accepting reviews."></i>
                        `}
else{tableHtml+=`<p style="color: green;">Accepted</p>`}
tableHtml+=`</td>`;break;case COLUMN.VERIFY:tableHtml+=`
                        <td id="unverified-review-data-${review.review_id}">
                            <form method="POST" class="unverified-review-form" id="unverified-review-form-${review.review_id}">
                                <input type="hidden" name="id" value="${review.review_id}">
                                <input type="hidden" name="type" value="review">
                                <input type="hidden" name="verified" value="1">
                                <button class="btn btn-success btn-lg"type="submit">Verify</button>
                            </form>
                            <form method="POST" class="unverified-review-form" id="unverified-review-form-${review.review_id}">
                                <input type="hidden" name="id" value="${review.review_id}">
                                <input type="hidden" name="type" value="review">
                                <input type="hidden" name="verified" value="-1">
                                <button class="btn btn-warning btn-lg"type="submit">Reject</button>
                            </form>
                        </td>
                    `}}
tableHtml+=`</tr>`;}
tableHtml+=`
        </tbody>
    </table>
    `
$(`#${targetId}`).html(tableHtml);$('[data-toggle="tooltip"]').tooltip();}
function sortReviews(reviews,direction){var reviews_=reviews.slice(0)
if(!["desc","asc"].includes(direction)){throw new Error(`Expected \`direction\` to be one of ["desc", "asc"], got ${direction}`)}
reviews_.sort(function(r1,r2){return direction=="desc"?r2.rating-r1.rating:r1.rating-r2.rating});return reviews_;}