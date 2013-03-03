
import shutil, os
import tarfile
import json

def concat(dst, src1, src2):
    destination = open(dst, 'wb')
    shutil.copyfileobj(open(src1, 'rb'), destination)
    shutil.copyfileobj(open(src2, 'rb'), destination)
    destination.close()

def tarLinuxFiles(tarname, src):
    tar = tarfile.open(tarname, "w:gz")
    for name in ["libffmpegsumo.so", "muvconf", "nw.pak"]:
        tar.add(src + "/" + name, arcname=name)
    tar.close()

print ''
print '>>> Build node-webkit'


print '  - Load package.json'
package = json.load(file("package.json"))
version = package['version']


root_dir = "nw"
root_win32 = root_dir + "/win32";
root_lin32 = root_dir + "/lin32";
root_lin64 = root_dir + "/lin64";
root_nw = "../../Tools/node-webkit-v0.4.2-"
tarname_x32 = root_dir + "/muvconf-" + version + "-ia32.tar.gz"
tarname_x64 = root_dir + "/muvconf-" + version + "-x64.tar.gz"
nw_name = root_dir + "/muvconf-" + version + ".nw"
winzip_x32 = root_dir + "/muvconf-" + version + "-x86"


if not os.path.exists(root_dir):
    os.makedirs(root_dir)


print '  - Remove old files'
if os.path.exists(nw_name):
    os.remove(nw_name)
if os.path.exists(root_win32):
    shutil.rmtree(root_win32)
if os.path.exists(root_lin32):
    shutil.rmtree(root_lin32)
if os.path.exists(root_lin64):
    shutil.rmtree(root_lin64)
if os.path.exists(tarname_x32):
    os.remove(tarname_x32)
if os.path.exists(tarname_x64):
    os.remove(tarname_x64)


print '  - Create .nw file'
shutil.copyfile("package.json", "build/package.json")
shutil.make_archive(root_dir + "/muvconf", format="zip", root_dir="build")
shutil.move(root_dir + "/muvconf.zip", nw_name)
	

print '  - Build Windows x32'
shutil.copytree(root_nw + "win-ia32", root_win32)
concat(root_win32 + "/muvconf.exe", root_win32 + "/nw.exe", nw_name)
os.remove(root_win32 + "/nw.exe")
os.remove(root_win32 + "/nwsnapshot.exe")
shutil.make_archive(winzip_x32, format="zip", root_dir=root_win32)


def buildLinux(root_lin, nwextra, tarname):
    shutil.copytree(root_nw + nwextra, root_lin)
    concat(root_lin + "/muvconf", root_lin + "/nw", nw_name)
    os.remove(root_lin + "/nw")
    os.remove(root_lin + "/nwsnapshot")
    tarLinuxFiles(tarname, root_lin)


print '  - Build Linux x32'
buildLinux(root_lin32, "linux-ia32", tarname_x32);

print '  - Build Linux x64'
buildLinux(root_lin64, "linux-x64", tarname_x64);





