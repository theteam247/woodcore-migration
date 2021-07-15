#include <string>
#include <map>
#include <vector>
using namespace std;
extern char _binary_html_index_html_start[];
extern char _binary_html_index_html_end[];

extern char _binary_html_app_js_start[];
extern char _binary_html_app_js_end[];
extern char _binary_html_css_app_css_end[];
extern char _binary_html_css_app_css_start[];
extern char _binary_html_css_chunk_vendors_css_start[];
extern char _binary_html_css_chunk_vendors_css_end[];

extern char _binary_html_chunk_vendors_js_end[];
extern char _binary_html_chunk_vendors_js_start[];

extern char _binary_html_fonts_element_icons_ttf_start[];
extern char _binary_html_fonts_element_icons_ttf_end[];

extern char _binary_html_fonts_Heebo_Black_ttf_start[];
extern char _binary_html_fonts_Heebo_Black_ttf_end[];
extern char _binary_html_fonts_Heebo_Bold_ttf_start[];
extern char _binary_html_fonts_Heebo_Bold_ttf_end[];
extern char _binary_html_fonts_Heebo_ExtraBold_ttf_start[];
extern char _binary_html_fonts_Heebo_ExtraBold_ttf_end[];
extern char _binary_html_fonts_Heebo_Light_ttf_start[];
extern char _binary_html_fonts_Heebo_Light_ttf_end[];
extern char _binary_html_fonts_Heebo_Medium_ttf_start[];
extern char _binary_html_fonts_Heebo_Medium_ttf_end[];
extern char _binary_html_fonts_Heebo_Regular_ttf_start[];
extern char _binary_html_fonts_Heebo_Regular_ttf_end[];
extern char _binary_html_fonts_Heebo_Thin_ttf_start[];
extern char _binary_html_fonts_Heebo_Thin_ttf_end[];
extern char _binary_html_fonts_ionicons_ttf_start[];
extern char _binary_html_fonts_ionicons_ttf_end[];



std::map<std::string,std::vector<char*>> filetable{
        {"index.html",{_binary_html_index_html_start,_binary_html_index_html_end}},
        {"app.js",{_binary_html_app_js_start,_binary_html_app_js_end}},
        {"app.css",{_binary_html_css_app_css_start,_binary_html_css_app_css_end}},
        {"chunk-verdors.css",{_binary_html_css_chunk_vendors_css_start,_binary_html_css_chunk_vendors_css_end}},
        {"chunk-vendors.js",{_binary_html_chunk_vendors_js_start,_binary_html_chunk_vendors_js_end}},

        {"element-icons.ttf",{_binary_html_fonts_element_icons_ttf_start,_binary_html_fonts_element_icons_ttf_end}},
        {"Heebo-Black.ttf",{_binary_html_fonts_Heebo_Black_ttf_start,_binary_html_fonts_Heebo_Black_ttf_end}},
        {"Heebo-Bold.ttf",{_binary_html_fonts_Heebo_Bold_ttf_start,_binary_html_fonts_Heebo_Bold_ttf_end}},
        {"Heebo-ExtraBold.ttf",{_binary_html_fonts_Heebo_ExtraBold_ttf_start,_binary_html_fonts_Heebo_ExtraBold_ttf_end}},
        {"Heebo-Light.ttf",{_binary_html_fonts_Heebo_Light_ttf_start,_binary_html_fonts_Heebo_Light_ttf_end}},
        {"Heebo-Medium.ttf",{_binary_html_fonts_Heebo_Medium_ttf_start,_binary_html_fonts_Heebo_Medium_ttf_end}},
        {"Heebo-Regular.ttf",{_binary_html_fonts_Heebo_Regular_ttf_start,_binary_html_fonts_Heebo_Regular_ttf_end}},
        {"Heebo-Thin.ttf",{_binary_html_fonts_Heebo_Thin_ttf_start,_binary_html_fonts_Heebo_Thin_ttf_end}},
        {"ionicons.ttf",{_binary_html_fonts_ionicons_ttf_start,_binary_html_fonts_ionicons_ttf_end}},



};
string gethtmlstr(string& url){
    auto iter = filetable.find(url);
    if(iter==filetable.end()){
     return string();
    }
	return string(filetable[url][0],static_cast<int>(filetable[url][1]-filetable[url][0]));
	
}