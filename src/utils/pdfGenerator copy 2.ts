import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Function to generate a PDF using pdfkit with header and footer images
export const generatePDF = (data: {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    address: string;
    day: string;
    month: string;
    year: number;
}, outputPath: string): Promise<void> => {
    
    return new Promise((resolve, reject) => {
        try {
            const dateSigned = `${data.day} ${data.month}, ${data.year}`;
            const doc = new PDFDocument({ margins: { top: 100, bottom: 100, left: 50, right: 50 } });
    
            // Write the PDF to a file
            const writeStream = fs.createWriteStream(outputPath);
            doc.pipe(writeStream);
    
            // Title (Centered and Large)
            doc.fontSize(24).font('Times-Bold').text('Terms of Engagement for Temporary Workers', { align: 'center' });
            doc.moveDown(5);
    
            // "between" text (Centered)
            doc.fontSize(16).font('Times-Roman').text('between', { align: 'center' });
            doc.moveDown(2);
    
            // Company Name (Centered and Bold)
            doc.fontSize(20).font('Times-Bold').text('COPORA LIMITED', { align: 'center' });
            doc.moveDown(3);
    
            // "and" text (Centered)
            doc.fontSize(16).font('Times-Roman').text('and', { align: 'center' });
            doc.moveDown(3);
    
            // Employee's Name (Centered and Bold)
            const employeeName = `${data.firstName} ${data.middleName || ''} ${data.lastName}`.trim();
            doc.fontSize(20).font('Times-Bold').text(employeeName, { align: 'center' });
    
            // Add a new page for the table of contents
            doc.addPage();

            // Title for the table of contents
            doc.fontSize(20).font('Times-Bold').text('Contents', { align: 'center' });
            doc.moveDown(2);

            // Table of Contents Entries
            const contents = [
                { clause: '1', title: 'Interpretation', page: '3' },
                { clause: '2', title: 'The agreement', page: '5' },
                { clause: '3', title: 'Assignments', page: '6' },
                { clause: '4', title: 'Temporary worker\'s obligations', page: '7' },
                { clause: '5', title: 'Remuneration', page: '8' },
                { clause: '6', title: 'Time sheets', page: '8' },
                { clause: '7', title: 'Annual leave', page: '8' },
                { clause: '8', title: 'Sickness absence', page: '9' },
                { clause: '9', title: 'Termination', page: '9' },
                { clause: '10', title: 'Intellectual property rights', page: '10' },
                { clause: '11', title: 'Confidentiality', page: '10' },
                { clause: '12', title: 'Data protection', page: '10' },
                { clause: '13', title: 'Warranties and indemnities', page: '11' },
                { clause: '14', title: 'No partnership or agency', page: '11' },
                { clause: '15', title: 'Entire agreement', page: '12' },
                { clause: '16', title: 'Third Party rights', page: '12' },
                { clause: '17', title: 'Notices', page: '12' },
                { clause: '18', title: 'Severance', page: '13' },
                { clause: '19', title: 'Governing law', page: '13' },
                { clause: '20', title: 'Jurisdiction', page: '13' },
                { clause: '21', title: 'Disclaimer', page: '13' },
            ];

            // Iterate through the contents to add them to the PDF
            contents.forEach((item) => {
                // Set up the text formatting
                doc.fontSize(12).font('Times-Roman');

                // Format the line with dots between the title and page number
                const line = `${item.clause}. ${item.title}`;
                const dots = '.'.repeat(125 - line.length); // Adjust for line length consistency
                const formattedLine = `${line}${dots}${item.page}`;

                // Add the formatted line to the PDF
                doc.text(formattedLine, { align: 'left' });
                doc.moveDown(0.5);
            });


            // Add a new page for the next section
            doc.addPage();

            // Title and spacing for the agreement section
            doc.fontSize(20).font('Times-Bold').text(`THIS AGREEMENT is dated ${dateSigned}`, { align: 'center' });
            doc.moveDown(2);

            // Parties section
            doc.fontSize(12).font('Times-Roman').text('Parties', { align: 'left' });
            doc.moveDown(1);

            // Details of the parties
            doc.text(
                '(1) COPORA LTD incorporated and registered in England and Wales with company number 09864017 whose registered office is at 71-75 Shelton Street, Covent Garden, London, England, WC2H 9JQ (Employment Business).',
                { align: 'left', indent: 20 }
            );
            doc.moveDown(1);

            doc.text('(2) of', { align: 'left', indent: 20 });
            doc.moveDown(2);

            // Agreed terms section
            doc.fontSize(12).font('Times-Bold').text('Agreed terms', { align: 'left' });
            doc.moveDown(1);

            // Interpretation section
            doc.fontSize(12).font('Times-Bold').text('1. Interpretation', { align: 'left' });
            doc.moveDown(1);

            // Subclause 1.1
            doc.fontSize(12).font('Times-Roman').text('1.1 The definitions and rules of interpretation in this clause apply to this agreement.', { align: 'left' });
            doc.moveDown(1);

            // Definitions and their descriptions
            const definitions = [
                { term: 'Assignment', description: 'the temporary services to be carried out by the Temporary Worker for the Client, as more particularly described in clause 3 and in the Assignment Confirmation.' },
                { term: 'AWR 2010', description: 'the Agency Workers Regulations 2010 (SI 2010/93).' },
                { term: 'Assignment Confirmation', description: 'written confirmation of the detail of a particular Assignment to be given to the Temporary Worker on acceptance of that Assignment.' },
                { term: 'Business Day', description: 'a day other than a Saturday, Sunday or public holiday when banks in England are open for business.' },
                { term: 'Calendar Week', description: 'shall have the meaning in regulation 7(4) of the AWR 2010.' },
                { term: 'Client', description: 'the person, firm, partnership, company or Group company (as the case may be) to whom the Temporary Worker is Introduced or supplied.' },
                { term: 'Conduct Regulations 2003', description: 'the Conduct of Employment Agencies and Employment Business Regulations 2003 (SI 2003/3319).' },
                { term: 'Confidential Information', description: 'information in whatever form (including without limitation, in written, oral, visual or electronic form or on any magnetic or optical disk or memory and wherever located) relating to the business, customers, products, affairs and finances of the Client, the Employment Business for the time being confidential to the Client, the Employment Business [and trade secrets including, without limitation, technical data and know-how relating to the business of the Client or the Employment Business or of any Group company or any of its suppliers, customers, agents, distributors, shareholders, management or business contacts, including (but not limited to) information that the Temporary Worker creates, develops, receives or obtains in connection with the Assignment, whether or not such information (if in anything other than oral form) is marked confidential.' },
                { term: 'Engage', description: 'the employment of a Temporary Worker or the engagement directly or indirectly through any employment business other than through the Employment Business (whether for a definite or indefinite period) of a Temporary Worker as a direct result of any Introduction or Assignment to the Client and the term Engaged shall be construed accordingly.' },
                { term: 'Group', description: 'in relation to a company, that company, each and any subsidiary or holding company of that company.' },
                { term: 'Holding company', description: 'has the meaning given in clause 1.5.' }
            ];

            // Iterate through the definitions and add them to the PDF
            definitions.forEach((item) => {
                // Format the term in bold and its description in regular text
                doc.font('Times-Bold').text(`${item.term}:`, { continued: true });
                doc.font('Times-Roman').text(` ${item.description}`, { align: 'left', indent: 20 });
                doc.moveDown(1);
            });

            // Add a new page for the next section
            doc.addPage();

            // Intellectual Property Rights and related definitions section
            const additionalDefinitions = [
                {
                    term: 'Intellectual Property Rights',
                    description: 'patents, rights to inventions, copyright and related rights, moral rights, trade marks, trade names and domain names, rights in get-up, rights in goodwill or to sue for passing off, rights in designs, rights in computer software, database rights, rights in confidential information (including know-how and trade secrets) and any other intellectual property rights, in each case whether registered or unregistered and including all applications (or rights to apply) for, and renewals or extensions of, such rights and all similar or equivalent rights or forms of protection which may now or in the future subsist in any part of the world.'
                },
                {
                    term: 'Introduce',
                    description: 'the provision to the Client of information by the Employment Business [by way of a curriculum vitae or in such format as the Client may from time to time require] which identifies the Temporary Worker and Introduction and Introduced shall be construed accordingly.'
                },
                {
                    term: 'Other Qualifying Period Payment',
                    description: 'any remuneration payable to the Temporary Worker (other than the Qualifying Period Rate of Pay), which is not excluded by virtue of regulation 6 of the AWR 2010, such as any overtime, shift premium, commission or any bonus, incentive or rewards which are directly attributable to the amount or quality of work done by a Temporary Worker and are not linked to a financial participation scheme (as defined by the AWR 2010).'
                },
                {
                    term: 'Qualifying Period',
                    description: '12 continuous Calendar Weeks, as defined in regulation 7 of the AWR 2010, subject always to regulations 8 and 9 of the AWR 2010.'
                },
                {
                    term: 'Qualifying Period Rate of Pay',
                    description: 'the rate of pay that will be paid to the Temporary Worker on completion of the Qualifying Period, if this rate is higher than the Rate of Pay. Such rate will be paid for each hour worked during an Assignment (to the nearest quarter hour) weekly in arrears, subject to any deductions that the Employment Business is required to make by law and to any deductions that the Temporary Worker has specifically agreed can be made.'
                },
                {
                    term: 'Rate of Pay',
                    description: 'the rate of pay that will be paid to the Temporary Worker prior to completion of the Qualifying Period. Such rate will be paid for each hour worked during an Assignment (to the nearest quarter hour) weekly in arrears, subject to any deductions that the Employment Business is required to make by law and to any deductions which the Temporary Worker has specifically agreed can be made.'
                },
                {
                    term: 'Relevant Period',
                    description: 'shall have the meaning set out in regulation 10(5) and (6) of the Conduct Regulations 2003.'
                },
                {
                    term: 'Relevant Terms and Conditions',
                    description: 'the relevant terms and conditions as defined in regulation 6 of the AWR 2010 that apply once the Temporary Worker has completed the Qualifying Period.'
                },
                {
                    term: 'Required Assignment Information',
                    description: 'shall have the meaning set out at clause 3.3.'
                },
                {
                    term: 'Subsidiary',
                    description: 'has the meaning given in clause 1.5.'
                },
                {
                    term: 'Temporary Worker',
                    description: 'a worker Introduced and supplied by the Employment Business to the Client to provide services to the Client not as an employee of the Client, who is deemed to be an agency worker for the purposes of regulation 3 of the AWR 2010.'
                },
                {
                    term: 'Temporary Work Agency',
                    description: 'shall have the meaning set out in regulation 4(1) of the AWR 2010.'
                },
                {
                    term: 'Vulnerable Person',
                    description: 'shall have the meaning set out in regulation 2 of the Conduct Regulations 2003.'
                },
                {
                    term: 'WTR 1998',
                    description: 'the Working Time Regulations 1998 (SI 1988/1833).'
                }
            ];

            // Iterate through the additional definitions and add them to the PDF
            additionalDefinitions.forEach((item) => {
                // Format the term in bold and its description in regular text
                doc.font('Times-Bold').text(`${item.term}:`, { continued: true });
                doc.font('Times-Roman').text(` ${item.description}`, { align: 'left', indent: 20 });
                doc.moveDown(1);
            });

            // Adding clause 1.2 after the list of definitions
            doc.moveDown(1);
            doc.font('Times-Bold').text('1.2', { continued: true });
            doc.font('Times-Roman').text(' A person includes a natural person, corporate or unincorporated body (whether or not having separate legal personality).', { align: 'left', indent: 20 });

            // Add a new page for the next section
            doc.addPage();

            // Adding the new clauses and sections
            const clausesAndSections = [
                {
                    clause: '1.3',
                    text: 'The Schedules form part of this agreement and shall have effect as if set out in full in the body of this agreement. Any reference to this agreement includes the Schedules.'
                },
                {
                    clause: '1.4',
                    text: 'A reference to a company shall include any company, corporation or other body corporate, wherever and however incorporated or established.'
                },
                {
                    clause: '1.5',
                    text: 'A reference to a holding company or a subsidiary means a holding company or a subsidiary (as the case may be) as defined in section 1159 of the Companies Act 2006 [and a company shall be treated, for the purposes only of the membership requirement contained in sections 1159(1)(b) and (c), as a member of another company even if its shares in that other company are registered in the name of (a) another person (or its nominee) by way of security or in connection with the taking of security, or (b) its nominee]. In the case of a limited liability partnership which is a subsidiary of a company or another limited liability partnership, section 1159 of the Companies Act 2006 shall be amended so that: (a) references in sections 1159(1)(a) and (c) to voting rights are to the members\' rights to vote on all or substantially all matters which are decided by a vote of the members of the limited liability partnership; and (b) the reference in section 1159(1)(b) to the right to appoint or remove a majority of its board of directors is to the right to appoint or remove members holding a majority of the voting rights.'
                },
                {
                    clause: '1.6',
                    text: 'A reference to a statute or statutory provision is a reference to it as amended, extended or re-enacted from time to time.'
                },
                {
                    clause: '1.7',
                    text: 'A reference to a statute or statutory provision shall include all subordinate legislation made from time to time under that statute or statutory provision.'
                },
                {
                    clause: '1.8',
                    text: 'A reference to writing or written includes fax and e-mail.'
                },
                {
                    clause: '1.9',
                    text: 'Any obligation on a party not to do something includes an obligation not to allow that thing to be done.'
                },
                {
                    clause: '1.10',
                    text: 'A reference to this agreement or to any other agreement or document referred to in this agreement is a reference to this agreement or such other agreement or document as varied or novated (in each case, other than in breach of the provisions of this agreement) from time to time.'
                },
                {
                    clause: '1.11',
                    text: 'References to clauses and Schedules are to the clauses and Schedules of this agreement and references to paragraphs are to paragraphs of the relevant Schedule.'
                },
                {
                    clause: '1.12',
                    text: 'Any words following the terms including, include, in particular, for example or any similar expression shall be construed as illustrative and shall not limit the sense of the words, description, definition, phrase or term preceding those terms.'
                },
                {
                    clause: '2. The agreement',
                    text: ''
                },
                {
                    clause: '2.1',
                    text: 'These terms set out the entire agreement between the Employment Business and the Temporary Worker for the supply of services to the Client and shall govern all Assignments undertaken by the Temporary Worker (including, for the avoidance of doubt, where the Temporary Worker undertakes an Assignment without having signed these terms). No contract shall exist between the Employment Business and the Temporary Worker between Assignments.'
                },
                {
                    clause: '2.2',
                    text: 'For the avoidance of doubt, this agreement constitutes a contract for services and not a contract of employment between the Employment Business and the Temporary Worker or the Temporary Worker and the Client.'
                },
                {
                    clause: '2.3',
                    text: 'For the purposes of the Conduct Regulations 2003, the Employment Business acts as an Employment Business in relation to the Introduction and supply of the Temporary Worker to the Client.'
                }
            ];

            // Iterate through the clauses and sections, and add them to the PDF
            clausesAndSections.forEach((item) => {
                // Format the clause number in bold and its text in regular font
                doc.font('Times-Bold').text(`${item.clause}`, { continued: true });
                doc.font('Times-Roman').text(` ${item.text}`, { align: 'left', indent: 20 });
                doc.moveDown(1);
            });

            // Add a new page for the "Assignments" section
            doc.addPage();

            // Adding the "Assignments" section and clauses
            const assignmentsSection = [
                {
                    clause: '3. Assignments',
                    text: ''
                },
                {
                    clause: '3.1',
                    text: 'The Employment Business will endeavour to obtain suitable Assignments for the Temporary Worker to perform the type of work specified in the Assignment Confirmation. The Employment Business is not obliged to offer an Assignment to the Temporary Worker and the Temporary Worker shall not be obliged to accept any Assignment offered by the Employment Business.'
                },
                {
                    clause: '3.2',
                    text: 'The Temporary Worker acknowledges that the nature of temporary work means that there may be periods when no suitable work is available. The Temporary Worker agrees that suitability of an Assignment shall be determined solely by the Employment Business and that the Employment Business shall incur no liability to the Temporary Worker should it fail to offer Assignments of the type of work specified in the Assignment Confirmation or any other work.'
                },
                {
                    clause: '3.3',
                    text: 'Except as provided below, at the same time as an Assignment is offered to the Temporary Worker, the Employment Business shall provide the Temporary Worker with the following information (the Assignment Confirmation):'
                },
                {
                    clause: '(a)',
                    text: 'the identity of the Client, and if applicable the nature of its business;'
                },
                {
                    clause: '(b)',
                    text: 'the date the Assignment is to commence and the duration or likely duration of the Assignment;'
                },
                {
                    clause: '(c)',
                    text: 'the position which the Client seeks to fill, including the type of work the Temporary Worker in that position would be required to do, the location at which, and the hours during which, the Temporary Worker would be required to work;'
                },
                {
                    clause: '(d)',
                    text: 'the Rate of Pay and any expenses payable by or to the Temporary Worker;'
                },
                {
                    clause: '(e)',
                    text: 'any risks to health and safety known to the Client in relation to the Assignment and the steps the Client has taken to prevent or control such risks; and'
                },
                {
                    clause: '(f)',
                    text: 'the experience, training, qualifications and any authorisation which the Client considers are necessary or which are required by law or a professional body for the Temporary Worker to possess in order to work in the Assignment.'
                },
                {
                    clause: '3.4',
                    text: 'Where the Assignment Confirmation is not given in paper form or by electronic means, the Employment Business shall confirm it in writing or electronically as soon as possible and in any event will endeavour to confirm no later than the end of the third Business Day following the day on which the Assignment was offered to the Temporary Worker.'
                },
                {
                    clause: '3.5',
                    text: 'Unless the Temporary Worker requests otherwise, clause 3.3 will not apply where the Temporary Worker is being Introduced or supplied to the Client to work in the same position as one in which the Temporary Worker has previously been supplied within the previous five Business Days and the Assignment Confirmation (with the exception of the date or likely duration of the Assignment) is the same as that already given to the Temporary Worker.'
                },
                {
                    clause: '3.6',
                    text: 'Subject to clause 3.5 and clause 3.7, where the Assignment is intended to last for five consecutive Business Days or less and the Assignment Confirmation has previously been given to the Temporary Worker and remains unchanged, the Employment Business shall provide written confirmation of the identity of the Client and the likely duration of the Assignment.'
                },
                {
                    clause: '3.7',
                    text: 'Where the provisions of clause 3.6 have been met but the Assignment extends beyond the intended five consecutive Business Day period, the Employment Business shall provide the remaining Assignment Confirmation to the Temporary Worker in paper or electronic form within eight Business Days of the start of the Assignment or by the end of the Assignment, if sooner.'
                }
            ];

            // Iterate through the clauses and sections, and add them to the PDF
            assignmentsSection.forEach((item) => {
                // Format the clause number in bold and its text in regular font
                doc.font('Times-Bold').text(`${item.clause}`, { continued: true });
                doc.font('Times-Roman').text(` ${item.text}`, { align: 'left', indent: 20 });
                doc.moveDown(1);
            });

            // Add a new page for the "Temporary Worker's Obligations" section
            doc.addPage();

            // Adding the "Temporary Worker's Obligations" section and clauses
            const obligationsSection = [
                {
                    clause: '4. Temporary Worker\'s Obligations',
                    text: ''
                },
                {
                    clause: '4.1',
                    text: 'The Temporary Worker is not obliged to accept any Assignment offered by the Employment Business. If the Temporary Worker does accept an Assignment, the Temporary Worker shall:'
                },
                {
                    clause: '(a)',
                    text: 'co-operate with the Client\'s reasonable instructions and accept the direction, supervision and control of any responsible person in the Client\'s organisation;'
                },
                {
                    clause: '(b)',
                    text: 'observe any relevant rules and regulations of the Client\'s organisation (including normal hours of work) of which the Temporary Worker has been informed or of which the Temporary Worker should be reasonably aware;'
                },
                {
                    clause: '(c)',
                    text: 'co-operate with the Employment Business in the completion and renewal of all mandatory checks;'
                },
                {
                    clause: '(d)',
                    text: 'where the Assignment involves working with any Vulnerable Persons, provide the Employment Business with copies of any relevant qualifications or authorisations including an up-to-date Disclosure and Barring Service certificate and two references which are from persons who are not related to the Temporary Worker;'
                },
                {
                    clause: '(e)',
                    text: 'take all reasonable steps to safeguard their own health and safety and that of any other person who may be present or be affected by their actions on the Assignment and comply with the health and safety policies of the Client;'
                },
                {
                    clause: '(f)',
                    text: 'not engage in any conduct detrimental to the interests of the Employment Business or the Client;'
                },
                {
                    clause: '(g)',
                    text: 'comply with all relevant statutes, laws, regulations and codes of practice from time to time in force in the performance of the Assignment and applicable to the Client\'s business, including without limitation, any equal opportunities or non-harassment policies.'
                },
                {
                    clause: '4.2',
                    text: 'If the Temporary Worker accepts any Assignment offered by the Employment Business, as soon as possible before the commencement of each such Assignment and during each Assignment (as appropriate) and at any time at the Employment Business\' request, the Temporary Worker undertakes to:'
                },
                {
                    clause: '(a)',
                    text: 'inform the Employment Business in writing or electronically of any Calendar Weeks whether before the date of commencement of the relevant Assignment or during the relevant Assignment in which the Temporary Worker has worked in the same or a similar role with the Client, direct or via any third party;'
                },
                {
                    clause: '(b)',
                    text: 'provide the Employment Business in writing or electronically with all the details of such work, including (without limitation) details of when, where and the period(s) during which such work was undertaken, the role performed and any other details requested by the Employment Business; and'
                },
                {
                    clause: '(c)',
                    text: 'inform the Employment Business in writing or electronically if before the date of the commencement of the relevant Assignment the Temporary Worker has:'
                },
                {
                    clause: '(i)',
                    text: 'completed two or more assignments with the Client;'
                },
                {
                    clause: '(ii)',
                    text: 'completed at least one assignment with the Client and one or more assignments with a member of the Client\'s Group; or'
                },
                {
                    clause: '(iii)',
                    text: 'worked in more than two roles during an assignment with the Client and on at least two occasions has worked in a role that was not the same role as the previous role.'
                }
            ];

            // Iterate through the clauses and sections, and add them to the PDF
            obligationsSection.forEach((item) => {
                // Format the clause number in bold and its text in regular font
                doc.font('Times-Bold').text(`${item.clause}`, { continued: true });
                doc.font('Times-Roman').text(` ${item.text}`, { align: 'left', indent: 20 });
                doc.moveDown(1);
            });

            // Adding new clauses for "Temporary Worker's Obligations," "Remuneration," "Time Sheets," and "Annual Leave" sections
            const additionalSectionsOne = [
                {
                    clause: '4.3',
                    text: 'If the Temporary Worker is unable for any reason to attend work during the course of an Assignment, they should first inform the Employment Business at least twenty four hours before their normal start time (to enable alternative arrangements to be made). If this is not possible, the Temporary Worker should inform the Employment Business as soon as possible.'
                },
                {
                    clause: '4.4',
                    text: 'If, either before or during the course of an Assignment, the Temporary Worker becomes aware of any reason why they may not be suitable for an Assignment, they shall notify the Employment Business without delay.'
                },
                {
                    clause: '5. Remuneration',
                    text: ''
                },
                {
                    clause: '5.1',
                    text: 'Subject to the Temporary Worker submitting properly authorised time sheets in accordance with clause 6, the Employment Business shall pay the Rate of Pay to the Temporary Worker. The Rate of Pay will be set out in the relevant Assignment Confirmation for a particular Assignment.'
                },
                {
                    clause: '5.2',
                    text: 'Where the Relevant Terms and Conditions contain a performance-related bonus for which the Temporary Worker may be eligible, the Temporary Worker will comply with any requirements of the Employment Business or the Client relating to the assessment of the Temporary Worker\'s performance for the purpose of determining entitlement to such bonus and the amount of any such bonus. If the Temporary Worker satisfies the relevant assessment criteria, the Employment Business will pay the Temporary Worker the bonus less any deductions that the employment business is required to make by law at the relevant time.'
                },
                {
                    clause: '5.3',
                    text: 'Subject to any applicable statutory entitlement and to clause 7 and clause 8, the Temporary Worker is not entitled to receive payment from the Employment Business or the Client for time not spent working on the Assignment, whether in respect of holidays, illness or absence for any other reason, unless otherwise agreed.'
                },
                {
                    clause: '6. Time Sheets',
                    text: ''
                },
                {
                    clause: '6.1',
                    text: 'At the end of each week of an Assignment (or at the end of an Assignment if it is for a period of one week or less or is completed before the end of a week) the Temporary Worker shall deliver electronically or hardcopies in person to the Employment Business a completed time sheet indicating the number of hours worked during the preceding week (or such lesser period) and signed by an authorised representative of the Client.'
                },
                {
                    clause: '6.2',
                    text: 'Subject to clause 6.3, the Employment Business shall endeavour to pay the Temporary Worker for all hours worked on a weekly basis, but will pay no later than on a fortnightly basis regardless of whether the Employment Business has received payment from the Client for those hours.'
                },
                {
                    clause: '6.3',
                    text: 'Where the Temporary Worker fails to submit a properly authorised time sheet, any payment due to the Temporary Worker may be delayed while the Employment Business investigates (in a timely fashion) what hours, if any, were worked by the Temporary Worker. The Employment Business shall make no payment to the Temporary Worker for hours not worked.'
                },
                {
                    clause: '6.4',
                    text: 'The Temporary Worker acknowledges and accepts that it could be a criminal offence under the Fraud Act 2006 to falsify any time sheet, for example by claiming payment for hours that were not actually worked.'
                },
                {
                    clause: '7. Annual Leave',
                    text: ''
                },
                {
                    clause: '7.1',
                    text: 'All entitlement to annual leave must be taken during the course of the holiday year in which it accrues and no untaken holiday can be carried forward to the next holiday year.'
                }
            ];

            // Iterate through the additional sections and add them to the PDF
            additionalSectionsOne.forEach((item) => {
                // Format the clause number in bold and its text in regular font
                doc.font('Times-Bold').text(`${item.clause}`, { continued: true });
                doc.font('Times-Roman').text(` ${item.text}`, { align: 'left', indent: 20 });
                doc.moveDown(1);
            });

           // Adding additional clauses for "Annual Leave," "Sickness Absence," and "Termination" sections
            const additionalSectionsTwo = [
                {
                    clause: '7.2',
                    text: 'The Temporary Worker should give at least two weeks\' notice of any proposed holiday dates and these must be agreed by the Recruitment Manager in writing in advance. No more than 11 days\' holiday may be taken at any one time unless prior consent is obtained from the Recruitment Manager. The Employment Business may require the Temporary Worker to take holiday on specific days, as notified to the Temporary Worker.'
                },
                {
                    clause: '7.3',
                    text: 'At the end of the Assignment the Temporary Worker shall be entitled to be paid in lieu of accrued but untaken holiday for the holiday year in which termination takes place.'
                },
                {
                    clause: '7.4',
                    text: 'If the Temporary Worker has taken more holiday than their accrued entitlement at the end of the Assignment, the Employment Business shall be entitled to deduct the appropriate amount from any payments due to the Temporary Worker.'
                },
                {
                    clause: '8. Sickness Absence',
                    text: ''
                },
                {
                    clause: '8.1',
                    text: 'If the Temporary Worker is absent from work for any reason, they must notify the Recruitment Manager of the reason for their absence as soon as possible but no later than 2 hours before the assignment is due to begin.'
                },
                {
                    clause: '8.2',
                    text: 'If the Temporary Worker satisfies the qualifying conditions laid down by law, they may be entitled to receive Statutory Sick Pay (SSP) at the prevailing rate in respect of any period of sickness or injury during the Assignment. The Temporary Worker will not be entitled to any other payments during such period.'
                },
                {
                    clause: '8.3',
                    text: 'In all cases of absence, a self-certification form, which is available from the Recruitment Manager, must be completed on the Temporary Worker\'s return to work and supplied to the Recruitment Manager. For any period of incapacity due to sickness or injury which lasts for seven consecutive days or more, a doctor\'s certificate (a "statement of fitness for work") stating the reason for absence must be obtained at the Temporary Worker\'s own cost and supplied to the Recruitment Manager. Further certificates must be obtained if the absence continues for longer than the period of the original certificate. If the Temporary Worker is certified as "fit for work" the Employment Business, the Temporary Worker and the Client will discuss any additional measures that may be needed to facilitate the Temporary Worker\'s return to work. If appropriate measures cannot be taken, the Temporary Worker will remain on sick leave and the Employment Business will set a date to review the situation.'
                },
                {
                    clause: '8.4',
                    text: 'The Temporary Worker\'s qualifying days for SSP purposes are Sunday to Saturday.'
                },
                {
                    clause: '9. Termination',
                    text: ''
                },
                {
                    clause: '9.1',
                    text: 'The Employment Business or the Client may terminate the Assignment at any time without prior notice or liability.'
                },
                {
                    clause: '9.2',
                    text: 'The Temporary Worker will provide a minimum of 24 hours’ notice should they wish to terminate the Assignment without prior notice or liability.'
                },
                {
                    clause: '9.3',
                    text: 'The Temporary Worker acknowledges that the continuation of an Assignment is subject to and dependent on the continuation of the agreement entered into between the Employment Business and the Client. If that agreement is terminated for any reason, the Assignment shall cease with immediate effect without liability to the Temporary Worker, except for payment for work done up to the date of termination of the Assignment.'
                },
                {
                    clause: '9.4',
                    text: 'Unless exceptional circumstances apply, the Temporary Worker\'s failure to inform the Client or the Employment Business of their inability to attend work as required by clause 4.3 will be treated as termination of the Assignment by the Temporary Worker.'
                }
            ];

            // Iterate through the additional sections and add them to the PDF
            additionalSectionsTwo.forEach((item) => {
                // Format the clause number in bold and its text in regular font
                doc.font('Times-Bold').text(`${item.clause}`, { continued: true });
                doc.font('Times-Roman').text(` ${item.text}`, { align: 'left', indent: 20 });
                doc.moveDown(1);
            });

            // Adding more clauses for "Termination", "Intellectual Property Rights", "Confidentiality", and "Data Protection"
            const additionalSectionsThree = [
                {
                    clause: '9.5',
                    text: 'If the Temporary Worker is absent during the course of an Assignment and the Assignment has not otherwise been terminated, the Employment Business will be entitled to terminate the Assignment in accordance with clause 9.1 if the work to which the Temporary Worker was assigned is no longer available.'
                },
                {
                    clause: '10. Intellectual Property Rights',
                    text: 'The Temporary Worker acknowledges that all Intellectual Property Rights deriving from services carried out by the Temporary Worker for the Client during the Assignment shall belong to the Client. Accordingly, the Temporary Worker shall execute all such documents and do all such acts as the Employment Business shall from time to time require in order to give effect to the Client\'s rights pursuant to this clause.'
                },
                {
                    clause: '11. Confidentiality',
                    text: ''
                },
                {
                    clause: '11.1',
                    text: 'In order to protect the confidentiality and trade secrets of the Employment Business and the Client, the Temporary Worker agrees not at any time:'
                },
                {
                    clause: '11.1(a)',
                    text: 'whether during or after an Assignment (unless expressly so authorised by the Client or the Employment Business as a necessary part of the performance of their duties), to disclose to any person or to make use of any of the trade secrets or the Confidential Information of the Client or the Employment Business; or'
                },
                {
                    clause: '11.1(b)',
                    text: 'to make any copy, abstract or summary of the whole or any part of any document or other material belonging to the Client or the Employment Business except when required to do so in the course of the Temporary Worker\'s duties under an Assignment, in which circumstances such copy abstract or summary would belong to the Client or the Employment Business, as appropriate.'
                },
                {
                    clause: '11.2',
                    text: 'The restriction in clause 11.1 does not apply to:'
                },
                {
                    clause: '11.2(a)',
                    text: 'any use or disclosure authorised by the Client or the Employment Business or as required by law a court of competent jurisdiction or any governmental or regulatory authority;'
                },
                {
                    clause: '11.2(b)',
                    text: 'any information which is already in, or comes into, the public domain otherwise than through the Temporary Worker\'s unauthorised disclosure; or'
                },
                {
                    clause: '11.2(c)',
                    text: 'the making of a protected disclosure within the meaning of section 43A of the Employment Rights Act 1996.'
                },
                {
                    clause: '11.3',
                    text: 'At the end of each Assignment or on request the Temporary Worker agrees to deliver up to the Client or the Employment Business (as directed) all documents (including copies), ID cards, swipe cards, equipment, passwords, pass codes and other materials belonging to the Client which are in its possession, including any data produced, maintained or stored on the Client\'s computer systems or other electronic equipment.'
                },
                {
                    clause: '12. Data Protection',
                    text: ''
                },
                {
                    clause: '12.1',
                    text: 'The Temporary Worker consents to the Employment Business and the Client [and any other intermediary involved in supplying the services of the Temporary Worker to the Client] holding and processing data relating to them for legal, personnel, administrative and management purposes and in particular to the processing of any "sensitive personal data" as defined in the Data Protection Act 1998 relating to them including, as appropriate:'
                },
                {
                    clause: '12.1(a)',
                    text: 'information about their physical or mental health or condition to monitor sick leave and take decisions as to their fitness for work;'
                }
            ];

            // Iterate through the additional sections and add them to the PDF
            additionalSectionsThree.forEach((item) => {
                // Format the clause number in bold and its text in regular font
                doc.font('Times-Bold').text(`${item.clause}`, { continued: true });
                doc.font('Times-Roman').text(` ${item.text}`, { align: 'left', indent: 20 });
                doc.moveDown(1);
            });

            // Adding additional clauses for "Data Protection," "Warranties and Indemnities," and "No Partnership or Agency" sections
            const additionalSectionsFour = [
                {
                    clause: '12.1 (b)',
                    text: 'their racial or ethnic origin or religious or similar beliefs to monitor compliance with equal opportunities legislation;'
                },
                {
                    clause: '12.1 (c)',
                    text: 'information relating to any criminal proceedings in which they have been involved for insurance purposes and to comply with legal requirements and obligations to third parties;'
                },
                {
                    clause: '12.2',
                    text: 'The Temporary Worker consents to the Employment Business and the Client or any intermediary involved in supplying the Temporary Worker\'s services to the Client making such information available to the Client, other Group companies, those who provide products or services to the Employment Business (such as advisers), regulatory authorities, governmental or quasi-governmental organisations, and potential purchasers of the Employment Business or other Group companies or any part of its business.'
                },
                {
                    clause: '12.3',
                    text: 'The Temporary Worker consents to the transfer of such information outside the European Economic Area for purposes connected with the performance of this agreement.'
                },
                {
                    clause: '13. Warranties and Indemnities',
                    text: ''
                },
                {
                    clause: '13.1',
                    text: 'The Temporary Worker warrants that:'
                },
                {
                    clause: '13.1 (a)',
                    text: 'the information supplied to the Employment Business in any application documents is correct;'
                },
                {
                    clause: '13.1 (b)',
                    text: 'the Temporary Worker has the experience, training, qualifications and any authorisation which the Client considers are necessary or which are required by law or by any professional body for the Temporary Worker to possess in order to perform the Assignment;'
                },
                {
                    clause: '13.1 (c)',
                    text: 'the Temporary Worker is not prevented by any other agreement, arrangement, restriction (including, without limitation, a restriction in favour of any employment agency, employment business or client) or any other reason, from fulfilling the Temporary Worker\'s obligations under this agreement; and'
                },
                {
                    clause: '13.1 (d)',
                    text: 'the Temporary Worker has valid and subsisting leave to enter and remain in the United Kingdom for the duration of this agreement and is not (in relation to such leave) subject to any conditions which may preclude or have an adverse effect on the Assignment.'
                },
                {
                    clause: '13.2',
                    text: 'The Temporary Worker shall indemnify and keep indemnified the Employment Business and the Client against all Demands (including legal and other professional fees and expenses) which the Employment Business or the Client may suffer, sustain, incur, pay or be put to arising from or in connection with:'
                },
                {
                    clause: '13.2 (a)',
                    text: 'any failure by the Temporary Worker to comply with its obligations under this agreement;'
                },
                {
                    clause: '13.2 (b)',
                    text: 'any negligent or fraudulent act or omission by the Temporary Worker;'
                },
                {
                    clause: '13.2 (c)',
                    text: 'the disclosure by the Temporary Worker of any Confidential Information;'
                },
                {
                    clause: '13.2 (d)',
                    text: 'any employment-related claim brought by the Temporary Worker in connection with the Assignment; or'
                },
                {
                    clause: '13.2 (e)',
                    text: 'the infringement by the Temporary Worker of the Client\'s or any Group Company\'s Intellectual Property Rights.'
                },
                {
                    clause: '14. No Partnership or Agency',
                    text: ''
                },
                {
                    clause: '14.1',
                    text: 'Nothing in this agreement is intended to, or shall be deemed to, establish any partnership or joint venture between any of the parties, constitute any party the agent of another party, or authorise any party to make or enter into any commitments for or on behalf of any other party.'
                }
            ];

            // Iterate through the additional sections and add them to the PDF
            additionalSectionsFour.forEach((item) => {
                // Format the clause number in bold and its text in regular font
                doc.font('Times-Bold').text(`${item.clause}`, { continued: true });
                doc.font('Times-Roman').text(` ${item.text}`, { align: 'left', indent: 20 });
                doc.moveDown(1);
            });

            // Adding additional clauses for "No Partnership or Agency," "Entire Agreement," "Third Party Rights," and "Notices" sections
            const additionalSectionsFive = [
                {
                    clause: '14.2',
                    text: 'Each party confirms it is acting on its own behalf and not for the benefit of any other person.'
                },
                {
                    clause: '15. Entire Agreement',
                    text: ''
                },
                {
                    clause: '15.1',
                    text: 'This agreement constitutes the entire agreement between the parties and supersedes and extinguishes all previous agreements, promises, assurances, warranties, representations and understandings between them, whether written or oral, relating to its subject matter.'
                },
                {
                    clause: '15.2',
                    text: 'Each party acknowledges that in entering into this agreement it does not rely on, and shall have no remedies in respect of, any statement, representation, assurance or warranty (whether made innocently or negligently) that is not set out in this agreement.'
                },
                {
                    clause: '15.3',
                    text: 'No variation of this agreement shall be effective unless it is in writing and signed by each of the parties (or their authorised representatives). A written copy of the varied terms, including the date from which they take effect, shall be given to the Temporary Worker no later than the fifth Business Day following the day on which the variation was agreed.'
                },
                {
                    clause: '15.4',
                    text: 'Nothing in this clause shall limit or exclude any liability for fraud.'
                },
                {
                    clause: '15.5',
                    text: 'Each party agrees that it shall have no claim for innocent or negligent misrepresentation based on any statement in this agreement.'
                },
                {
                    clause: '16. Third Party Rights',
                    text: 'No one other than a party to this agreement, their successors and permitted assignees, shall have any right to enforce any of its terms.'
                },
                {
                    clause: '17. Notices',
                    text: ''
                },
                {
                    clause: '17.1',
                    text: 'Any notice or other communication given to a party under or in connection with this agreement shall be in writing and shall be:'
                },
                {
                    clause: '17.1 (a)',
                    text: 'delivered by hand or by pre-paid first-class post or other next working day delivery service at its registered office (if a company) or its principal place of business (in any other case); or'
                },
                {
                    clause: '17.1 (b)',
                    text: 'sent by fax to its main fax number.'
                },
                {
                    clause: '17.1 (c)',
                    text: 'sent by email to or from the Recruitment Manager.'
                },
                {
                    clause: '17.2',
                    text: 'Any notice or communication shall be deemed to have been received:'
                },
                {
                    clause: '17.2 (a)',
                    text: 'if delivered by hand, on signature of a delivery receipt or at the time the notice is left at the proper address;'
                },
                {
                    clause: '17.2 (b)',
                    text: 'if sent by pre-paid first-class post or other next working day delivery service, at 11:00 am on the second Business Day after posting or at the time recorded by the delivery service.'
                },
                {
                    clause: '17.2 (c)',
                    text: 'if sent by fax, at 11:00 am on the next Business Day after transmission.'
                },
                {
                    clause: '17.2 (d)',
                    text: 'if sent by email, at 11:00 am on the next Business Day after transmission.'
                },
                {
                    clause: '17.3',
                    text: 'This clause does not apply to the service of any proceedings or other documents in any legal action or, where applicable, any arbitration or other method of dispute resolution.'
                }
            ];

            // Iterate through the additional sections and add them to the PDF
            additionalSectionsFive.forEach((item) => {
                // Format the clause number in bold and its text in regular font
                doc.font('Times-Bold').text(`${item.clause}`, { continued: true });
                doc.font('Times-Roman').text(` ${item.text}`, { align: 'left', indent: 20 });
                doc.moveDown(1);
            });

            // Adding additional clauses for "Severance," "Governing Law," "Jurisdiction," and "Disclaimer" sections
            const furtherSections = [
                {
                    clause: '18. Severance',
                    text: ''
                },
                {
                    clause: '18.1',
                    text: 'If any provision or part-provision of this agreement is or becomes invalid, illegal or unenforceable, it shall be deemed modified to the minimum extent necessary to make it valid, legal and enforceable. If such modification is not possible, the relevant provision or part-provision shall be deemed deleted. Any modification to or deletion of a provision or part-provision under this clause shall not affect the validity and enforceability of the rest of this agreement.'
                },
                {
                    clause: '18.2',
                    text: 'If one party gives notice to the other of the possibility that any provision or part-provision of this agreement is invalid, illegal or unenforceable, the parties shall negotiate in good faith to amend such provision so that, as amended, it is legal, valid and enforceable, and, to the greatest extent possible, achieves the intended commercial result of the original provision.'
                },
                {
                    clause: '19. Governing Law',
                    text: 'This agreement and any dispute or claim arising out of or in connection with it or its subject matter or formation (including non-contractual disputes or claims) shall be governed by and construed in accordance with the law of England and Wales.'
                },
                {
                    clause: '20. Jurisdiction',
                    text: 'Each party irrevocably agrees that the courts of England and Wales shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with this agreement or its subject matter or formation (including non-contractual disputes or claims).'
                },
                {
                    clause: '21. Disclaimer',
                    text: 'Before entering into this agreement you should visit the website www.gov.uk/agency-workers-your-rights which provides some basic information regarding your rights under the Agency Workers Regulations 2010. [If you need further information regarding your rights under the Agency Workers Regulations 2010 then you should obtain legal advice before entering into this agreement.] By entering into this agreement you warrant, represent and confirm that you understand your rights under the Agency Workers Regulations 2010.'
                },
                {
                    clause: 'Conclusion',
                    text: 'This agreement has been entered into on the date stated at the beginning of it.'
                }
            ];

            // Iterate through the further sections and add them to the PDF
            furtherSections.forEach((item) => {
                // Format the clause number in bold and its text in regular font
                doc.font('Times-Bold').text(`${item.clause}`, { continued: true });
                doc.font('Times-Roman').text(` ${item.text}`, { align: 'left', indent: 20 });
                doc.moveDown(1);
            });

            // Add the signature section on a new page
            doc.addPage();

            // Title for the acceptance section
            doc.font('Times-Bold').fontSize(12).text('Above terms are accepted between COPORA Ltd and:', {
                align: 'left',
                indent: 20,
                lineGap: 15
            });

            // Add some space for the other party’s details
            doc.moveDown(3);

            // Signature section for COPORA Ltd
            doc.fontSize(10).font('Times-Roman').text('Signed on behalf of COPORA LTD:', { indent: 20 });
            doc.moveDown(1);

             // Details for COPORA Ltd's representative
             doc.text('Name: Andrew Smith', { indent: 40 });
             doc.moveDown(0.5);
             doc.text('Job Title: Chief Executive Director', { indent: 40 });
             doc.moveDown(0.5);
            //  doc.text(`Date: ${dateSigned}`, { indent: 40 });
            //  doc.moveDown(3);

            // Load and use cursive font for the signatures
            const cursiveFontPath = path.join(__dirname, 'fonts', 'GreatVibes-Regular.ttf');
            doc.font(cursiveFontPath);

            // Capture the current vertical position for the grid layout
            // const signatureYPosition = doc.y;

            // COPORA Ltd signature (left side)
            doc.fontSize(24).text('Andrew Smith', 50, { width: 200, align: 'left' });
            doc.font('Times-Roman').fontSize(12).text('Executive Director, Copora Limited', 50,{ width: 200, align: 'left' });
            doc.moveDown(2);
           
            doc.text(`Date: ${dateSigned}`, 50, doc.y, { width: 200, align: 'left' });

            // Signature section for the other party
            doc.text(`Signed by: ${data.firstName} ${data.middleName || ''} ${data.lastName}`, { indent: 20 });
            doc.moveDown(1.5);
            doc.text('`Date: ${dateSigned}`', { indent: 20 });

            // Employee Signature (right side)
            doc.font(cursiveFontPath);
            doc.fontSize(24).text(`${data.firstName} ${data.lastName}`, 400, { width: 200, align: 'left' });
            doc.font('Times-Roman').fontSize(12).text('Employee', 400, { width: 200, align: 'left' });
            doc.moveDown(2);
            doc.text(`Date: ${dateSigned}`, 400, doc.y, { width: 200, align: 'left' });

            // Finalize the PDF file if not already done in previous code
            doc.end();

            // Listen for the 'finish' event to resolve the promise when the PDF is fully written
            writeStream.on('finish', resolve);


        } catch (error) {
            console.error('Error generating PDF:', error);
            reject(error);
        }
    });
    
    
};
