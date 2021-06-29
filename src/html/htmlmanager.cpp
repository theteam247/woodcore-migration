#include <string>
#include <map>
#include <vector>
using namespace std;
extern char _binary_html_index_html_start[];
extern char _binary_html_index_html_end[];

extern char _binary_html_mainjs_js_start[];
extern char _binary_html_mainjs_js_end[];
extern char _binary_html_manifest_js_end[];
extern char _binary_html_manifest_js_start[];
extern char _binary_html_vendor_js_end[];
extern char _binary_html_vendor_js_start[];

extern char _binary_html_fonts_535877f50039c0cb49a6196a5b7517cd_woff_start[];
extern char _binary_html_fonts_535877f50039c0cb49a6196a5b7517cd_woff_end[];
extern char _binary_html_fonts_732389ded34cb9c52dd88271f1345af9_ttf_start[];
extern char _binary_html_fonts_732389ded34cb9c52dd88271f1345af9_ttf_end[];
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
extern char _binary_html_fonts_ionicons_woff_start[];
extern char _binary_html_fonts_ionicons_woff_end[];


std::map<std::string,std::vector<char*>> filetable{
        {"index.html",{_binary_html_index_html_start,_binary_html_index_html_end}},
        {"mainjs.js",{_binary_html_mainjs_js_start,_binary_html_mainjs_js_end}},
        {"manifest.js",{_binary_html_manifest_js_start,_binary_html_manifest_js_end}},
        {"vendor.js",{_binary_html_vendor_js_start,_binary_html_vendor_js_end}},

        {"535877f50039c0cb49a6196a5b7517cd.woff",{_binary_html_fonts_535877f50039c0cb49a6196a5b7517cd_woff_start,_binary_html_fonts_535877f50039c0cb49a6196a5b7517cd_woff_end}},
        {"732389ded34cb9c52dd88271f1345af9.ttf",{_binary_html_fonts_732389ded34cb9c52dd88271f1345af9_ttf_start,_binary_html_fonts_732389ded34cb9c52dd88271f1345af9_ttf_end}},
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