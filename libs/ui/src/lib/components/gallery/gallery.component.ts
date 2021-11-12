import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ui-gallery',
    templateUrl: './gallery.component.html',
    styles: []
})
export class GalleryComponent implements OnInit {
    selectedImageUrl: string | undefined;

    @Input() images: string[] | undefined;

    ngOnInit(): void {
        if (this.images?.length) {
            this.selectedImageUrl = this.images[0];
        }
    }

    ChangeSelectedImage(imageUrl: string) {
        this.selectedImageUrl = imageUrl;
    }

    get hasImages() {
        if (this.images?.length) {
            return this.images.length > 0;
        } else {
            return false;
        }
    }
}
