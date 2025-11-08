from django import forms

class PDFUploadForm(forms.Form):
    pdf_file = forms.FileField(
        required=True,
        label="Upload one PDF at a time"
    )



class PDFSplitForm(forms.Form):
    pdf_file = forms.FileField(
        required=True,
        label="Select a PDF to split"
    )
    # Example: 1-3,5,7-9
    ranges = forms.CharField(
        required=True,
        label="Page ranges (e.g. 1-3,5,7-9)",
        widget=forms.TextInput(attrs={'placeholder': '1-3,5,7-9'})
    )
