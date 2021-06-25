#include <string>
#include <map>
#include <vector>
using namespace std;
extern char _binary_index_html_start[];
extern char _binary_index_html_end[];

extern char _binary_mainjs_js_start[];
extern char _binary_mainjs_js_end[];
extern char _binary_manifest_js_end[];
extern char _binary_manifest_js_start[];
extern char _binary_vendor_js_end[];
extern char _binary_vendor_js_start[];
std::map<std::string,std::vector<char*>> filetable{
        {"index.html",{_binary_index_html_start,_binary_index_html_end}},
        {"mainjs.js",{_binary_mainjs_js_start,_binary_mainjs_js_end}},
        {"manifest.js",{_binary_manifest_js_start,_binary_manifest_js_end}},
        {"vendor.js",{_binary_vendor_js_start,_binary_vendor_js_end}}
};
string gethtmlstr(string& url){
	return string(filetable[url][0],static_cast<int>(filetable[url][1]-filetable[url][0]));
	
}