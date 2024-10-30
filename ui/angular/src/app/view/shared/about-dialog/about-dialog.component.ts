import { Component, inject, TemplateRef, ViewChild } from '@angular/core';

import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'about-dialog',
	standalone: true,
	imports: [NgbDatepickerModule],
	templateUrl: './about-dialog.component.html',
})

export class AboutDialog {
	private modalService = inject(NgbModal);
	closeResult = '';
    apiName = '';
    version = '';
    
    @ViewChild('content', { read: TemplateRef }) content:TemplateRef<any> | undefined;

	open(aboutDetail : any) {

        this.apiName = aboutDetail.apiName;
        this.version = aboutDetail.version;

		this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}
}