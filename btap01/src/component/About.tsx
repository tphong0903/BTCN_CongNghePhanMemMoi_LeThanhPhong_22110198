import { Mail, MapPin } from "lucide-react";

const About = () => {
  return (
    <section
      id="about"
      className="py-20 md:py-32 "
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* CARD */}
          <div className="bg-white shadow-2xl rounded-3xl p-10 border border-pink-200 hover:shadow-pink-300 transition-all duration-300">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              Thông tin sinh viên
            </h2>

            <div className="space-y-6 text-lg text-gray-700">
              <p>
                Họ tên {" "}
                <span className="font-semibold text-indigo-600"> Lê Thanh Phong</span>
              </p>

              <p>
                MSSV{" "}
                <span className="font-medium text-indigo-500">
                  22110198
                </span>{" "}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-around gap-4 pt-6 border-t border-pink-200">
                <div className="flex items-center gap-2">
                  <Mail className="text-purple-500" />
                  <span>22110198@student.hcmute.edu.vn</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-indigo-500" />
                  <span>Số 1, Võ Văn Ngân</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
