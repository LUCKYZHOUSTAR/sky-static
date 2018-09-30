package cmc.admin.stc.web.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.MessageDigest;

public class DigestUtils {

	final static Logger log = LoggerFactory.getLogger(DigestUtils.class);

	public static String md5Encode(String message) {
		return Encode("MD5", message);
	}

	public static String sha256Encode(String message) {
		return Encode("SHA-256", message);
	}

	private static String Encode(String code, String message) {
		MessageDigest md;
		String encode = null;
		try {
			md = MessageDigest.getInstance(code);
			encode = bytes2Hex(md.digest(message.getBytes("UTF-8")));
		} catch (Exception e) {
			log.error(String.format("code:[%s],message:[%s]", code, message), e);
		}
		return encode;
	}

	public static String bytes2Hex(byte[] bts) {
		String des = "";
		String tmp = null;
		for (int i = 0; i < bts.length; i++) {
			tmp = (Integer.toHexString(bts[i] & 0xFF));
			if (tmp.length() == 1) {
				des += "0";
			}
			des += tmp;
		}
		return des;
	}

	public static String getPassWord(String mobile, String password) {
		String s = mobile + password;
		if (null == password || password.isEmpty()) {
			s = mobile + "mtime123456";
		}
		return sha256Encode(s);
	}
}
