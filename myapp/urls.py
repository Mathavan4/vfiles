from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),                    
    path('merge/', views.merge_pdfs, name='merge_pdfs'),  
    path('merged_download/', views.merged_download, name='merged_download'),

    path('split/', views.split_pdf, name='split_pdf'),
    path('split_result/', views.split_result, name='split_result'),
    path('download_split/', views.download_split, name='download_split'),
    
    path('compress/', views.compress_pdf_page, name='compress_pdf'),
    path('compress/upload/', views.compress_upload, name='compress_upload'),
    path('compress/result/', views.compress_result_page, name='compress_result'),

    path('convert/pdf-to-word/', views.pdf_to_word_view, name='pdf_to_word'),
    path('convert/upload/', views.convert_upload, name='convert_upload'),
    path('convert/result/', views.convert_result, name='convert_result'),
    
    path("pdf-to-ppt/", views.pdf_to_ppt_page, name="pdf_to_ppt_page"),
    path("pdf-to-ppt/convert/", views.pdf_to_ppt_convert, name="pdf_to_ppt_convert"),
    

    path('word-to-pdf/', views.word_to_pdf, name='word_to_pdf'),
    path('word-to-pdf/download/', views.word_to_pdf_download, name='word_to_pdf_download'),
    path('word-to-pdf/file/', views.download_converted_pdf, name='download_converted_pdf'),

    path("image-to-pdf/", views.image_to_pdf_view, name="image_to_pdf"),
    path("convert/image-to-pdf/", views.convert_image_to_pdf, name="convert_image_to_pdf"),
    
    path('pdf-to-image/', views.pdf_to_image_page, name='pdf_to_image'),
    path('convert/pdf-to-image/', views.convert_pdf_to_image, name='convert_pdf_to_image'),
    path('download/zip/', views.download_zip, name='download_zip'),
    
    path('image-compress/', views.image_compress_page, name='image_compress'),
    path('convert/image-compress/', views.compress_images, name='compress_images'),

    path("pdf-protect/", views.pdf_protect_page, name="pdf_protect"),
    path("pdf-protect/convert/", views.pdf_protect_convert, name="pdf_protect_convert"),

    path('pdf-unlock/', views.pdf_unlock_page, name='pdf_unlock_page'),
    path('pdf-unlock/convert/', views.pdf_unlock_convert, name='pdf_unlock_convert'),
   
    path("pdf-watermark/", views.pdf_watermark, name="pdf_watermark"),
    path("preview-watermark/", views.preview_watermark, name="preview_watermark"),

    path("sign_pdf/", views.sign_pdf_page, name="sign_pdf"),
    path("sign_pdf_action/", views.sign_pdf, name="sign_pdf_action"),

    path("pdf_to_excel/", views.pdf_to_excel_page, name="pdf_to_excel"),
    path("convert_pdf_to_excel/", views.convert_pdf_to_excel, name="convert_pdf_to_excel"),

    path('excel-to-pdf/', views.excel_to_pdf_view, name='excel_to_pdf'),
    path('excel-to-pdf/file/', views.excel_to_pdf_file, name='excel_to_pdf_file'),




    path("ppt_to_pdf/", views.ppt_to_pdf_page, name="ppt_to_pdf"),
    path("convert_ppt_to_pdf/", views.convert_ppt_to_pdf, name="convert_ppt_to_pdf"),

    path('signup/', views.signup_page, name='signup_page'),

    path('login/', views.login_page, name='login_page'),
    path('reset-password/', views.reset_password, name='reset_password'),
]
